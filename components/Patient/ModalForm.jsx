import React, { useRef, useState , useEffect } from 'react'
import { addUser ,getUser } from '../../services/user.services'
import { uploadLog } from '../../services/log.services'
import { 
  addNewPatient, 
  updatePatient, 
  updatePatientAccount 
} from '../../services/patient.services'
import { updateSessionContact } from '../../services/session.services'
import moment from 'moment'
import {
  fieldText,
  fieldSelect,
  fieldTextarea,
} from '../../components/Patient/Fields'

const ModalForm = ({ mode, closeModal, data, setData, notWorker }) => {

  const [defaultContact,setDefaultContact] = useState()
  const [errors, setErrors] = useState()
  const fnameRef = useRef()
  const lnameRef = useRef()
  const contactRef = useRef()
  const birthDateRef = useRef()
  const statusRef = useRef()
  const birthPlaceRef = useRef()
  const religionRef = useRef()
  const nationalityRef = useRef()
  const occupationRef = useRef()
  const addressRef = useRef()

  const spouse_fnameRef = useRef()
  const spouse_lnameRef = useRef()
  const spouse_birthDateRef = useRef()
  const spouse_religionRef = useRef()
  const spouse_occupationRef = useRef()

  const no_previousPregnanciesRef = useRef()
  const previousCaesareansRef = useRef()
  const consecutiveMiscarriagesRef = useRef()
  const postpartumHemorrhageRef = useRef()
  const importantNoteRef = useRef();

  const emergencyFnameRef = useRef()
  const emergencyLnameRef = useRef()
  const emergencyContactRef = useRef()
  const emergencyAddressRef = useRef()
  const [authUser,setAuthUser] = useState()

  useEffect(async() => {
    
    const user = await getUser()
    if(user.success){
      setAuthUser(user.data)
    }

    setDefaultContact(contactRef.current.value)
  },[])

  const saveHandler = async () => {
    const newData = {
      fname: fnameRef.current?.value,
      lname: lnameRef.current?.value,
      contact: contactRef.current?.value,
      birthDate: birthDateRef.current?.value,
      birthPlace: birthPlaceRef.current?.value,
      religion: religionRef.current?.value,
      nationality: nationalityRef.current?.value,
      occupation: occupationRef.current?.value,
      address: addressRef.current?.value,
      spouse_fname: spouse_fnameRef.current?.value,
      spouse_lname: spouse_lnameRef.current?.value,
      spouse_birthDate: spouse_birthDateRef.current?.value,
      spouse_occupation: spouse_occupationRef.current?.value,
      spouse_religion: spouse_religionRef.current?.value,
      no_previousPregnancies: no_previousPregnanciesRef.current?.value,
      previousCaesareans: previousCaesareansRef.current?.value,
      consecutiveMiscarriages: consecutiveMiscarriagesRef.current?.value,
      postpartumHemorrhage: postpartumHemorrhageRef.current?.value,
      importantNote:importantNoteRef.current?.value,
      emergencyFname: emergencyFnameRef.current?.value,
      emergencyLname: emergencyLnameRef.current?.value,
      emergencyContact: emergencyContactRef.current?.value,
      emergencyAddress: emergencyAddressRef.current?.value,
    }

    if (data) {
      const res_update = await updatePatient(data._id, newData)

      if (res_update.success) {
        closeModal('')
        setData({ _id: data._id, profileLink: data.profileLink, ...newData })

        const user_update = await updatePatientAccount(
          {
            "username":defaultContact,
            "newUsername":newData.contact
          })
        
        await updateSessionContact({
          id:data._id,
          name:`${newData.fname} ${newData.lname}`,
          contact:newData.contact })
        
        
        await uploadLog(
          { 
            username_FK: authUser.username,
            content: `${authUser.name} (@${authUser.username}) updated
            ${newData.fname[0].toUpperCase()+newData.fname.substring(1)}  
            ${newData.lname[0].toUpperCase()+newData.lname.substring(1)}'s general details`,
            
            category:"Add/Update Patient",
            role:authUser.role,
            date:moment(Date.now()).format("MMMM DD, YYYY"),
            time:moment(Date.now()).format("h:mm a")
          }
        )
      }

      setErrors(res_update.error)
    } else {
      newData.profileLink = ''
      const res_add = await addNewPatient(newData)

      if (res_add.success) {

        const user_add = await addUser({
          username: newData.contact,
          name: newData.fname+" "+newData.lname,
          password: 'blessedhope',
          patientID: res_add.data._id,
          role: 'patient',
        })

        await uploadLog(
          { 
            username_FK: authUser.username,
            content: `${authUser.name} (@${authUser.username}) added new patient:
            ${newData.fname[0].toUpperCase()+newData.fname.substring(1)}  
            ${newData.lname[0].toUpperCase()+newData.lname.substring(1)}`,
            
            category:"Add/Update Patient",
            role:authUser.role,
            date:moment(Date.now()).format("MMMM DD, YYYY"),
            time:moment(Date.now()).format("h:mm a")
          }
        )

        closeModal('')
      }
      
      setErrors(res_add.error)
    }
  }

  return (
    <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
      <div className="mx-4 max-h-patientModal overflow-auto rounded-md bg-white">
        <div className="sticky left-0 top-0 bg-white py-6 px-4">
          <p className="px-4 text-xl">
            {mode == 'add' ? 'Add new patient' : 'Update patient record'}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3">
          <div className="p-4">
            <p className="font-bold">Personal Information</p>
            {fieldText(
              errors?.fnameErr,
              'First name:',
              'fname',
              fnameRef,
              data?.fname
            )}
            {fieldText(
              errors?.lnameErr,
              'Last name:',
              'lname',
              lnameRef,
              data?.lname
            )}
            {fieldText(
              errors?.contactErr,
              'Contact#: (Ex: 9612345678)',
              'contact',
              contactRef,
              data?.contact,
              'number'
            )}
            {fieldText(
              errors?.birthDateErr,
              'Birth Date: ',
              'birthdate',
              birthDateRef,
              data?.birthDate && moment(data?.birthDate).format('YYYY-MM-DD'),
              'date'
            )}
            {fieldText(
              errors?.birthPlaceErr,
              'Birth Place: ',
              'birthplace',
              birthPlaceRef,
              data?.birthPlace
            )}
            {fieldText(
              errors?.religionErr,
              'Religion: ',
              'religion',
              religionRef,
              data?.religion
            )}
            {fieldText(
              errors?.nationalityErr,
              'Nationality: ',
              'nationality',
              nationalityRef,
              data?.nationality
            )}
            {fieldText(
              errors?.occupationErr,
              'Occupation: ',
              'occupation',
              occupationRef,
              data?.occupation
            )}
            {fieldTextarea(
              errors?.addressErr,
              'Address: ',
              'address',
              addressRef,
              data?.address
            )}
          </div>

          <div className="p-4">
            <p className="font-bold">Spouse Information</p>
            {fieldText(
              errors?.spouse_fnameErr,
              'First name:',
              'spouse_fname',
              spouse_fnameRef,
              data?.spouse_fname
            )}
            {fieldText(
              errors?.spouse_lnameErr,
              'Last name:',
              'spouse_lname',
              spouse_lnameRef,
              data?.spouse_lname
            )}
            {fieldText(
              errors?.spouse_birthDateErr,
              'Birth Date: ',
              'spouse_birthdate',
              spouse_birthDateRef,
              data?.spouse_birthDate &&
                moment(data?.spouse_birthDate).format('YYYY-MM-DD'),
              'date'
            )}
            {fieldText(
              errors?.spouse_religionErr,
              'Religion: ',
              'spouse_religion',
              spouse_religionRef,
              data?.spouse_religion
            )}
            {fieldText(
              errors?.spouse_occupationErr,
              'Occupation: ',
              'spouse_occupation',
              spouse_occupationRef,
              data?.spouse_occupation
            )}
            {notWorker ?
              <div>
              <p className="mt-9 mb-2 font-bold">
                Important Note
              </p>
              <p><i>{data?.importantNote}</i></p>
              </div>
               :
               fieldTextarea(
                null,
                'Important Note: ',
                'importantNote',
                importantNoteRef,
                data?.importantNote 
                ) 
            }
          </div>
          <div className="p-4">
            <p className="font-bold">Obstetrical History</p>
            {fieldText(
              errors?.no_previousPregnanciesErr,
              'No# of Previous Pregnancies:',
              'no_previousPregnancies',
              no_previousPregnanciesRef,
              data?.no_previousPregnancies,
              'number'
            )}
            {fieldText(
              errors?.previousCaesareansErr,
              'Previous Caesareans:',
              'previousCaesareans',
              previousCaesareansRef,
              data?.previousCaesareans,
              'number'
            )}
            {fieldSelect(
              errors?.consecutiveMiscarriagesErr,
              'Consecutive Miscarriages:',
              'consecutiveMiscarriages',
              consecutiveMiscarriagesRef,
              [
                { name: 'Yes', value: 'yes' },
                { name: 'No', value: 'no' },
              ],

              data?.consecutiveMiscarriages
            )}
            {fieldSelect(
              errors?.postpartumHemorrhageErr,
              'Postpartum Hemorrhage:',
              'postpartumHemorrhage',
              postpartumHemorrhageRef,
              [
                { name: 'Yes', value: 'yes' },
                { name: 'No', value: 'no' },
              ],
              data?.postpartumHemorrhage
            )}
            <p className="mt-10 font-bold">Emergency Details</p>
            {fieldText(
              errors?.emergencyFnameErr,
              'First name:',
              'emergencyFname',
              emergencyFnameRef,
              data?.emergencyFname
            )}
            {fieldText(
              errors?.emergencyLnameErr,
              'Last name:',
              'emergencyLname',
              emergencyLnameRef,
              data?.emergencyLname
            )}
            {fieldText(
              errors?.emergencyContactErr,
              'Contact #:',
              'emergencyContact',
              emergencyContactRef,
              data?.emergencyContact,
              'number'
            )}
            {fieldTextarea(
              errors?.emergencyAddressErr,
              'Address:',
              'emergencyAddress',
              emergencyAddressRef,
              data?.emergencyAddress
            )}
          </div>
        </div>
        <div className="sticky left-0 bottom-0 flex justify-end gap-4 bg-white py-6 px-4">
          <button
            onClick={() => closeModal('')}
            className="rounded-md bg-slate-100 px-4 py-3"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              saveHandler()
            }}
            className="rounded-md bg-primary px-4 py-3 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalForm
