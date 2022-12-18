import { getServerCancelSchedule, serverCancelSchedule, sendSmsCancelNote } from '../../services/cancelappointment.services'
import React, { useState , useRef } from 'react'
import NoLayout from '../../components/NoLayout'
import moment from 'moment'
import { uploadLog } from '../../services/log.services'

const cancellation = () => {	
  
  const mainID = useRef()
  const subID = useRef()
  const number = useRef()
  const code = useRef()
  const [info,setInfo] = useState() 
  const [table,setTable] = useState(false)
  const [message,setMessage] = useState()
  const [errorNotif,setErrorNotif] = useState()
  const [successNotif,setSuccessNotif] = useState()

  const clearFields = () => {
    number.current.value = ""
    code.current.value = ""
    setErrorNotif(false)
    setSuccessNotif(false)
    setTable(false)
  }

  const cancelSched = async() => {

    const res = await serverCancelSchedule({
      consultation: info.consultation,
      mainID: mainID.current,
      subID: subID.current,
      serverCancellationCode: code.current.value,
      contact: number.current.value,
    })

    if(res.success){
      number.current.value = ""
      code.current.value = ""
      setSuccessNotif(true)
      setTable(false)
      

      await sendSmsCancelNote({
        contact:info.contact,
        patientName: info.firstName + ' ' + info.lastName,
        date: moment(info.time.from).format("MMMM DD, YYYY"),
        timeslot: moment(info.time.from).format("h:mm a")+" - "+moment(info.time.to).format("h:mm a")
      })

      await uploadLog(
        { 
          username_FK: info.contact,
          content: `Staff ( ${info.time.username} ) cancelled the appoointment`,
          category:"Cancelled Appointment",
          role:info.consultation,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )

    }else{
      setErrorNotif(true)
      setMessage("Process failed: "+res.message)
    }
  }

  const validateField = async () => {
    setSuccessNotif(false)
    const newData = {serverCancellationCode:code.current.value,contact:number.current.value}
    const sched = await getServerCancelSchedule(newData)
   
    if(sched.success && (sched.data.status != "cancelled")){
      console.log(sched.mainID)
      mainID.current = sched.mainID+""
      subID.current = sched.subID+""
      setErrorNotif(false)
      setInfo(sched.data)
      setTable(true)
      
    }else{
      mainID.current = ""
      subID.current = ""
      setTable(false)
      setErrorNotif(true)
      setMessage(sched.message ? sched.message : "Invalid code or phone number")     
    }
  }

  return (
    <NoLayout>
      <div className="w-full h-full flex-col flex py-10  items-center justify-center">
        <p className="text-2xl font-semibold mb-10">Staff Cancel Appointment</p>
        
        <div className="w-1/4 grid gap-4 grid-rows-3">
        <input
            ref={number}
            className="block w-full rounded-md border border-inputBorder px-3 py-3"
            type="text"
            placeholder="Phone number (ex: 9657203177)"
        />

        <input
            ref={code}
            className="block w-full rounded-md border border-inputBorder px-3 py-3"
            type="text"
            placeholder="Cancellation code"
        />

          <div className="grid gap-2 grid-cols-2">
            <button className="w-full bg-gray-600 text-white" onClick={validateField}>Submit</button>
            <button className="w-full bg-sky-700 text-white" onClick={clearFields}>Clear</button>
          </div>

        </div>

        {
          errorNotif && 
          <p className="my-3 py-3 text-center w-1/4 text-red-600 bg-red-200">
            {message}
          </p>
        }
        
        {
          successNotif && 
          <p className="my-3 py-3 text-center w-1/4 text-emerald-600 bg-emerald-200">
            Your schedule has been cancelled
          </p>
        }

        { table && 
            <div className="mt-5 border py-3 px-4 border-neutral-500 w-1/4">
              <p className="font-semibold text-gray-800 text-base mb-3">Appointment Details</p>
              <p className="text-base">Name: {info.firstName} {info.lastName}</p>
              <p className="text-base">Contact: {info.contact}</p>
              <p className="text-base">Concern: {info.concern}</p>
              <p className="text-base">Date: {moment(info.date).format("MMMM DD, YYYY")}</p>
              <p className="text-base">Time: {moment(info.time.from).format("h:mm a")} - {moment(info.time.to).format(":mm a")} </p>
              <p className="text-base">Consultation Type: {info.consultation} </p>

              <div className="w-full flex justify-end mt-3">
                <button onClick={cancelSched} className="border rounded-md font-medium text-white bg-sky-700 py-1 px-3">Confirm Cancellation</button>
              </div>
            </div>
         }
      </div>
    </NoLayout>

  )
}

export default cancellation
