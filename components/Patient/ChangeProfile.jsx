import React, { useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import { uploadLog } from '../../services/log.services'
import { updatePatient } from '../../services/patient.services'
import { changeProfile } from '../../services/user.services'
import moment from 'moment'

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from 'firebase/storage'

import { storage } from './firebase'
import { v4 } from 'uuid'

import { dataURLtoFile } from './utils/dataURLtoFile'
import { generateDownload, getCroppedImg } from './utils/cropImage'

const ChangeProfile = ({
  role,
  closeModal,
  authUser,
  patientData,
  updateProfile,
  setIsChanged,
}) => {
  const inputRef = useRef()
  const triggerFileSelectPopup = () => {
    inputRef.current.click()
  }

  const [disableClick, setDisableClick] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [image, setImage] = useState(null)
  const [croppedArea, setCroppedArea] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  }

  const onUpload = async () => {
    if (image) {
      const canvas = await getCroppedImg(image, croppedArea)
      const canvasDataUrl = canvas.toDataURL('image/jpeg')

      const convertedUrlToFile = dataURLtoFile(
        canvasDataUrl,
        'cropped-image.jpeg'
      )

      const imageRef = ref(storage, `images/${'deuteronomy' + v4()} ${authUser._id}`)
      uploadBytes(imageRef, convertedUrlToFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          setUploading(true)
          if (role == 'Worker') {
            const workerProfile = await changeProfile(authUser._id, { profileLink: url })
            if (workerProfile.success) {
              
              await uploadLog(
                { 
                  username_FK: authUser.username,
                  content: `${authUser.name} (@${authUser.username}) changed his/her profile picture`,
                  category:"Staff - Change Profile",
                  role:authUser.role,
                  date:moment(Date.now()).format("MMMM DD, YYYY"),
                  time:moment(Date.now()).format("h:mm a")
                }
              )

              updateProfile(url)
              closeModal()
            }
          } else {
            const clientProfile = await updatePatient(patientData._id, { profileLink: url })
            if (clientProfile.success) {
              
              await uploadLog(
                { 
                  username_FK: authUser.username,
                  content: `${authUser.name} (@${authUser.username}) changed 
                    ${patientData.fname[0].toUpperCase() + patientData.fname.substring(1)} 
                    ${patientData.lname[0].toUpperCase() + patientData.lname.substring(1)}'s 
                    profile picture`,
                  category:"Patient - Change Profile",
                  role:authUser.role,
                  date:moment(Date.now()).format("MMMM DD, YYYY"),
                  time:moment(Date.now()).format("h:mm a")
                }
              )

              updateProfile()
              closeModal(false)
            }
          }
        })
      })
    }
  }

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length >= 0) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.addEventListener('load', () => {
        setImage(reader.result)
      })
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
        <div className="w-2/5 rounded-md bg-white px-7 py-5">
          <p className="mb-5 font-semibold text-xl">Change Picture</p>
          <div className="h-5/6 bg-white">
            {image ? (
              <>
                <div className="relative mb-3 h-96">
                  <Cropper
                    crop={crop}
                    image={image}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <Slider
                  min={1}
                  max={2}
                  step={0.1}
                  value={zoom}
                  onChange={(e, zoom) => setZoom(zoom)}
                />
              </>
            ) : (
              <div className="flex h-96 w-full items-center justify-center rounded-md bg-gray-200">
                Select a photo and crop it here
              </div>
            )}
          </div>
          <input
            onChange={onSelectFile}
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            ref={inputRef}
          />

          <div className="mt-6 flex justify-end gap-x-2">
            {uploading ? (
              <p>Uploading</p>
            ) : (
              <>
                <button
                  className="rounded-md bg-primary py-3 px-5 text-white"
                  onClick={triggerFileSelectPopup}
                >
                  Choose
                </button>
                <button
                  className="rounded-md border bg-gray-700 p-3 py-3 px-5 text-white"
                  onClick={onUpload}
                >
                  Upload
                </button>
                <button
                  className="rounded-md border border-gray-400 py-3 px-5"
                  onClick={() => closeModal(false)}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangeProfile
