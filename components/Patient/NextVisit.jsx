import React,{ useEffect , useState } from 'react'
import moment from 'moment'
import { uploadLog } from '../../services/log.services'
import { getUser } from '../../services/user.services'
import { sendSmsVisitNote } from '../../services/patient.services'
import { getNextVisit, getUpcomingVisit } from '../../services/session.services'
import NotificationSent from '../CustomModal/NotificationSent'

const NextVisit = () => {

  const [pageNumber,setPageNumber] = useState(0)
  const [dataPage,setDataPage] = useState([])
  const [schedule,setSchedule] = useState([])
  const [modal,setModal] = useState(false)
  const [authUser,setAuthUser] = useState()

  const filter = (subData) => {
    //2D array serves as a page

    subData.sort((a, b) => {
      let da = new Date(a.date),
        db = new Date(b.date);
    return db - da;
    })


    setPageNumber(0)
    var arr = [[]]
    var cnt = 0;

    for(let i = 0; i < subData.length; i++){
      if(i % 8 == 0 && i != 0){
        arr[cnt+1] = [subData[i]]
        cnt++
      }else{
        arr[cnt].push(subData[i])
      }
    }

    setDataPage(arr)
    setSchedule(arr[0])
  }

  useEffect(async() => {
    const res = await getUpcomingVisit(3)
    if(res.success) filter(res.subData)

    const user = await getUser()
    if(user.success){
      setAuthUser(user.data)
    }

  },[])

  const statusHandler = async (value) => {
    var res = await getUpcomingVisit(value)
    if (value == 0) {
      res = await getNextVisit()
    } 

    if (res.success){
      filter(res.subData)
    }
  }

  const notifyAll = async() => {    
    for(let z = 0; z < schedule.length; z++){

      const confirmation = await sendSmsVisitNote({
        patientName: schedule[z].name,
        date: schedule[z].date,
        contact: schedule[z].contact,
        month: schedule[z].month,
        pregnancyNo: schedule[z].pregnancyNo,
        visit: schedule[z].visit
      })

      await uploadLog(
        { 
          username_FK: authUser.username,
          content: `${authUser.name} (@${authUser.username}) sent an automated SMS notification to patients`,
          category:"SMS Next Visit",
          role:authUser.role,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )
    }

    if(schedule.length != 0) setModal(true)
  }

  const clickNext = () => {
    if(pageNumber != (dataPage.length-1)){
      setSchedule(dataPage[pageNumber+1])
      setPageNumber(pageNumber+1)
    }
  }

  const clickPrevious = () => {
    if(pageNumber != (dataPage.length) && pageNumber != 0){
      setSchedule(dataPage[pageNumber-1])
      setPageNumber(pageNumber-1)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        {(modal) ? <NotificationSent setModal={setModal}/> : <></>}
        <select
          id="x"
          onChange={(e) => statusHandler(e.target.value)}
          className="mt-2 block rounded-md border border-inputBorder px-3 py-2"
        >
          <option value={3}>3 days prior</option>
          <option value={5}>5 days prior</option>
          <option value={7}>7 days prior</option>
          <option value={0}>All</option>
        </select>
        <button onClick={() => notifyAll()} className="rounded-md bg-primary p-2 px-6 text-slate-100">
          Notify All
        </button>
      </div>
      <table className="my-4 w-full border-collapse border border-slate-400">
        <thead>
          <tr>
            <th className="border border-slate-300 p-4">Date</th>
            <th className="border border-slate-300 p-4">Name</th>
            <th className="border border-slate-300 p-4">Contact</th>
            <th className="border border-slate-300">Prenatal #</th>
            <th className="border border-slate-300 p-4">Month</th>     
            <th className="border border-slate-300 p-4">Visit</th>
          </tr>
        </thead>
        <tbody>
          {schedule?.length > 0 ? (
            schedule.map(
              ({ date, name, contact, pregnancyNo, month, visit }, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-slate-300 p-4">
                    {moment(date).format('MMM DD, YYYY')}
                  </td>
                  <td className="border border-slate-300 p-4">{name.charAt(0).toUpperCase() + name.slice(1)}</td>
                  <td className="border border-slate-300 p-4">{contact}</td>
                  <td className="uppercase border border-slate-300 p-4">{pregnancyNo}</td>
                  <td className="border border-slate-300 p-4">{month}</td>
                  <td className="border border-slate-300 p-4">{visit}</td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={5}
                className="border border-slate-300 p-4 text-center"
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mb-5 flex flex-row justify-between items-center w-full">
        <button onClick={clickPrevious} className="py-2 text-sm px-5 bg-gray-600 text-white rounded-md border">Previous</button>
        <p><b>{pageNumber+1}</b></p>
        <button onClick={clickNext} className="py-2 text-sm px-5 bg-gray-600 text-white rounded-md border">Next</button>
      </div>
      
   
      <p className="mb-20 p-3 bg-orange-100 text-center text-sm w-full">
        Here are recommended dates by the OB-Gyne and Midwives to the patients about when to create an appointment.
      </p>
      
      

    </>
  )
}

export default NextVisit
