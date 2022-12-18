import React, {useState,useRef} from 'react'
import { uploadLog } from '../../services/log.services'
import moment from 'moment'

const NewPregnancy = ({patientData,addPregnancy,closeModal,number,authUser}) => {
  
  const [error,setError] = useState(false)
  const textInput = useRef()
  
  const addNewPregnancy = async() => {
    
    if(textInput.current.value === number){
      await addPregnancy()
      await uploadLog(
        { 
          username_FK: authUser.username,
          content: `${authUser.name} (@${authUser.username}) added new prenatal record to 
                ${patientData.fname[0].toUpperCase() + patientData.fname.substring(1)} 
                ${patientData.lname[0].toUpperCase() + patientData.lname.substring(1)}`,
          category:"Add Prenatal Record",
          role:authUser.role,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )
      closeModal(false)
    }else{
      setError(true)
    }
  }

  return (
    <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
      <div className="w-1/4 flex flex-col rounded-md bg-white p-4">
        <p className="mb-5 font-semibold text-xl">Confirm New Pregnancy</p>
        <p className="mb-1 font-medium text-base">Please type this number: {number}</p>
        
        <input ref={textInput} className="border py-2 my-2" type="text"/>
        {error ? 
          <p className="py-3 mb-2 text-center w-full text-red-600 bg-red-200">
            Incorrect number
          </p>:
          <></>
        }
        <div className="grid gap-2 grid-cols-2">
          <button className="w-full p-2 text-white bg-primary border rounded-md" onClick={() => addNewPregnancy()}>Confirm</button>
          <button className="w-full p-2 text-white bg-gray-600 border rounded-md" onClick={() => closeModal(false)}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default NewPregnancy
