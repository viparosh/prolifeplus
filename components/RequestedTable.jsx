import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import Modal from './CustomModal/Modal'
import { fieldTextarea } from './Patient/Fields'
import { updateStatus } from '../services/worker.services'
import {
  dateScheduleFilter,
  sortSchedule,
  timeScheduleFilter,
  updateCalendarSchedule,
} from '../services/calendar.services'
import { getUser } from '../services/user.services'
import { getAllRequested } from '../services/worker.services'
import { uploadLog } from '../services/log.services'

const RequestedTable = ({ setData, data, update, header }) => {
  const [dataPage, setDataPage] = useState([])
  const [authUser, setAuthUser] = useState()
  const [timeSelected, setTimeSelected] = useState()
  const [error, setError] = useState(null)
  const [modal, setModal] = useState()
  const reasonRef = useRef("Time overlaps with another schedule")
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(async() => {
    setModal(false)
    const user = await getUser()
  
    if(user.success){
      setAuthUser(user.data)
    }

    filter()
  }, [])

  const clickNext = () => {
    if (pageNumber != dataPage.length - 1) {
      setData(dataPage[pageNumber + 1])
      setPageNumber(pageNumber + 1)
    }
  }

  const clickPrevious = () => {
    if (pageNumber != dataPage.length && pageNumber != 0) {
      setData(dataPage[pageNumber - 1])
      setPageNumber(pageNumber - 1)
    }
  }

  const filter = async () => {
    const res = await getAllRequested()

    if (res.success) {
      var arr = [[]]
      var cnt = 0

      for (let i = 0; i < res.data.length; i++) {
        if (i % 5 == 0 && i != 0) {
          arr[cnt + 1] = [res.data[i]]
          cnt++
        } else {
          arr[cnt].push(res.data[i])
        }
      }

      setDataPage(arr)

      if (arr[pageNumber] == null) {
        setPageNumber(pageNumber - 1)
        setData(arr[pageNumber - 1])
      } else {
        setData(arr[pageNumber])
      }

      setModal(false)
    }
  }
  
  const preAcceptHandler = () => {
    if (moment(timeSelected.date).format('ddd') == 'Sun') {
      setError({
        success: false,
        message: 'The requested date is Sunday and no service in this date!',
      })
    } else {
      acceptedHandler()
    }
  }
  const acceptedHandler = async () => {
    console.log(timeSelected.name)
    
    const newData = {
      status: 'accepted',
    }

    // format reference date
    const fetchData = await dateScheduleFilter([timeSelected.date])
    let reference = null

    if (timeSelected.role == 'obgyne') {
      reference = fetchData[0].data?.obgyn_schedule || []
    } else {
      reference = fetchData[0].data?.midWife_schedule || []
    }

    let date = moment(timeSelected.date).format('YYYY-MM-DD')

    const uid = uuidv4()
    let temp = []
    // format the reference from datetime to time and preserve the status value
    for (let i of reference) {
      let from = moment(i.from).format('HH:mm')
      let to = moment(i.to).format('HH:mm')
      let name = i.name
      let status = i.status
      let username = i.username
      temp.push([from, to, status, name, username, i.schedID])
    }

    console.log(timeSelected.name)

    temp.push([
      moment(timeSelected.from).format('HH:mm'),
      moment(timeSelected.to).format('HH:mm'),
      true,
      timeSelected.name,
      timeSelected.username,
      uid,
    ])

    let temp_schedule = []
    const result = await timeScheduleFilter(temp)
    let final = {}

    if (result.success) {
      
      temp_schedule = sortSchedule(result?.data, date)
      await uploadLog(
        { 
          username_FK: authUser.username,
          content: `${timeSelected.username}'s schedule ${moment(timeSelected.date).format("MM-DD-YYYY")} (${moment(timeSelected.from).format("h:mm a")} - ${moment(timeSelected.to).format("h:mm a")}) has been accepted`,
          category:"Manage Worker Schedule",
          role:`${authUser.name} (@${authUser.username}) - ${authUser.role}`,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )

      if (timeSelected.role == 'obgyne') {
        final = [
          {
            ...fetchData[0],
            data: { ...fetchData[0].data, obgyn_schedule: temp_schedule },
          },
        ]
      } else {
        final = [
          {
            ...fetchData[0],
            data: { ...fetchData[0].data, midWife_schedule: temp_schedule },
          },
        ]
      }

      const res = await updateStatus(newData, timeSelected._id)
      if (res.success) {
        const res = await updateCalendarSchedule(fetchData[0], final[0].data)
        if (res) filter()
        setError('')
        setModal('')
        return
      }
    } else {
      console.log('drop here')
    }

    setError(result)
    
  }

  const rejectedHandler = async () => {
    const newData = {
      status: 'rejected',
      remarks: reasonRef.current?.value,
    }


    const res = await updateStatus(newData, timeSelected._id)

    if (res.success){
      filter()

      await uploadLog(
        { 
          username_FK: authUser.username,
          content: `${timeSelected.username}'s schedule ${moment(timeSelected.date).format("MM-DD-YYYY")} (${moment(timeSelected.from).format("h:mm a")} - ${moment(timeSelected.to).format("h:mm a")}) has been rejected`,
          category:"Manage Worker Schedule",
          role:`${authUser.name} (@${authUser.username}) - ${authUser.role}`,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )
    }
     
  }

  const modalHandler = (mode, id) => {
    setModal(mode)
    setTimeSelected(data[id])
  }

  return (
    <>
      {modal &&
        (modal == 'reject' ? (
          <Modal text="Reject Schedule">
            {fieldTextarea(null, 'Reason:', 'reason', reasonRef)}
            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setModal(!modal)
                }}
                className=" mx-2 ml-0 rounded-md border p-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={rejectedHandler}
                className=" mx-2 ml-0 rounded-md border bg-primary p-2 px-4 text-slate-100"
              >
                Confirm
              </button>
            </div>
          </Modal>
        ) : (
          <Modal text="Accept Schedule">
            {error && (
              <p
                className={`my-4 rounded-md ${
                  !error?.success ? 'bg-red-500 ' : 'bg-emerald-500'
                }  px-4 py-2 text-white`}
              >
                {error?.message}
              </p>
            )}
            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setModal(!modal)
                }}
                className=" mx-2 ml-0 rounded-md border p-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={preAcceptHandler}
                className=" mx-2 ml-0 rounded-md border bg-primary p-2 px-4 text-slate-100"
              >
                Confirm
              </button>
            </div>
          </Modal>
        ))}
      <table className="my-4 w-full border-collapse border border-slate-400">
        <thead>
          <tr>
            {header.map((item, index) => (
              <th key={index} className="border border-slate-300 p-4">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map(
              (
                { _id, date, from, to, remarks, status, role, username, name },
                index
              ) => (
                <tr key={index} className="text-center">
                  <td className="border border-slate-300 p-4">
                    {moment(date).format('MMM DD, YYYY')}
                  </td>
                  <td className="border border-slate-300 p-4">
                    {moment(from).format('hh:mm a')}
                  </td>
                  <td className="border border-slate-300 p-4">
                    {moment(to).format('hh:mm a')}
                  </td>
                  {update ? (
                    <>
                      <td className="border border-slate-300 p-4 capitalize">
                        {role}
                      </td>
                      <td className="border border-slate-300 p-4">
                        {name}
                        <p className="text-sm font-[530]">{username}</p>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-slate-300 p-4 capitalize">
                        {status}
                      </td>
                      <td className="border border-slate-300 p-4">{remarks}</td>
                    </>
                  )}
                  {update && (
                    <>
                      <td className="border border-slate-300 p-4">
                        <button
                          className="bg-red-500 p-2 text-white"
                          onClick={() => {
                            modalHandler('reject', index)
                          }}
                        >
                          Reject
                        </button>
                      </td>
                      <td className="border border-slate-300 p-4">
                        <button
                          onClick={() => {
                            setError(null)
                            modalHandler('accept', index)
                          }}
                          className="bg-emerald-600 p-2 text-white"
                        >
                          Accept
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={update ? 7 : 5}
                className="border border-slate-300 p-4 text-center"
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mb-20 flex w-full flex-row items-center justify-between">
        <button
          onClick={clickPrevious}
          className="rounded-md border bg-gray-600 py-2 px-5 text-sm text-white"
        >
          Previous
        </button>
        <p>
          <b>{pageNumber + 1}</b>
        </p>
        <button
          onClick={clickNext}
          className="rounded-md border bg-gray-600 py-2 px-5 text-sm text-white"
        >
          Next
        </button>
      </div>
    </>
  )
}

export default RequestedTable
