import React, { useState, useRef, useEffect } from 'react'
import Layout from '../../components/Layout'
import { uploadLog } from '../../services/log.services'
import Modal from '../../components/CustomModal/Modal'
import { ChangePassword , ChangeProfile } from '../../components'
import { getUser , resetPassword } from '../../services/user.services'
import moment from 'moment'

const settings = () => {
  
  const [profile,setProfile] = useState(false)
  const patientUsername = useRef()
  const [text, setText] = useState('')
  const [modal, setModal] = useState(false)
  const [resetModal, setResetModal] = useState(null)
  const [authUser,setAuthUser] =  useState()
  const [profileModal,setProfileModal] = useState(false)

  useEffect(async() => {
    const user = await getUser()
    
    if(user.success){
      setAuthUser(user.data)
    }

  },[])

  const resetPatientPassword = async () => {
    const res = await resetPassword({contact:patientUsername.current.value})
    if(res.success){
      setResetModal(true)

      await uploadLog(
        { 
          username_FK: authUser.username,
          content: `${authUser.name} (@${authUser.username}) reset the password of ${patientUsername.current.value}`,
          category:"Reset Password",
          role:authUser.role,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )

    }else{
      setResetModal(false)
    }
    
  }
  const updateProfile = (url) => {
    setProfile(url)
  }

  return (
    <Layout profile={profile} title="Account Settings" role="Secretary">
      {profileModal ? <ChangeProfile role="Worker" updateProfile={updateProfile} closeModal={setProfileModal} authUser={authUser} /> : <></>}
      {modal ? <Modal setModal={setModal} text={text} /> : <></>}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ChangePassword authUser={authUser}  role="Secretary" />
        <div className="border-secondary rounded-md border px-4 py-4">
          <p>
            <b>Reset patient password</b>
          </p>
          <p>
            {(resetModal == true) ? (
              <p className="mt-4 bg-emerald-500 p-4 text-white">
                Patient password has been reset, <b>Password: blessedhope</b>
              </p>
            ) : 
              (resetModal == false) ? <p className="mt-4 bg-red-500 p-4 text-white">
                Patient not found
              </p> : <></>
            }
          </p>
          <div className="mt-5 flex flex-col gap-4">
            <div>
              <input
                ref={patientUsername}
                placeholder="Phone number"
                className="w-full rounded-md border border-inputBorder px-4 py-3"
              />
            </div>
            <button
              onClick={() => resetPatientPassword()}
              className="w-full flex-shrink-0 rounded-md border bg-primary p-4 text-white"
            >
              Reset password
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-secondary rounded-md border px-4 py-4">
          <p>
            <b>Change profile picture</b>
          </p>    

          <p className="text-sm my-2">
            Setup your profile by customizing your picture
          </p>
          <button
            onClick={() => setProfileModal(true)}
            className="w-full flex-shrink-0 rounded-md border bg-primary p-2 text-white"
          >
            Go
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default settings
