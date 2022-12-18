import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { getWorkerUsers } from '../../services/user.services'
import {
  timeScheduleFilter,
  dateScheduleFilter,
  sortSchedule,
  updateCalendarSchedule,
} from '../../services/calendar.services'
import {
  sendSmsNote,
  addAppointment,
  updateSchedule,
} from '../../services/appointment.services'

const CreatePriority = ({ setPriorityModal }) => {
  const [workerUsers, setWorkerUsers] = useState([])
  const [notifBox, setNotifBox] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(true)

  const firstName = useRef()
  const lastName = useRef()
  const contact = useRef()
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const concern = useRef()
  const [from, setFrom] = useState(moment().format('HH:mm'))
  const [to, setTo] = useState(moment().format('HH:mm'))

  const address = useRef()
  const username = useRef()

  useEffect(async () => {
    const userList = await getWorkerUsers()
    if (userList.success) {
      setWorkerUsers(userList.data)
    }
  }, [])

  function generateString(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  const submit = async () => {
    const uid = uuidv4()

    let sched = {
      firstName: firstName.current?.value,
      lastName: lastName.current?.value,
      date: date,
      concern: concern.current?.value,
      address: address.current?.value,
      username: username.current?.value,
      monthYear: moment(date).format('MMMM-YYYY'),
      contact: contact.current?.value,
      time: {
        from: moment(date).format('YYYY-MM-DD') + ' ' + from,
        to: moment(date).format('YYYY-MM-DD') + ' ' + to,
        username: username.current?.value,
        status: true,
        schedID: uid
      },
      consultation:"",
      cancellationCode:generateString(5),
      serverCancellationCode:generateString(5)
    }

    for (let g in workerUsers) {
      if (workerUsers[g].username == sched.username) {
        sched.consultation = workerUsers[g].role
        break
      }
    }

    let flag = false
    for (let c of Object.keys(sched)) {
      if (c != 'time' && c != 'date') {
        if (sched[c] == '') {
          flag = true
          break
        }
      }
    }

    if (flag) {
      setSuccess(false)
      setErrorMessage('Please fill all fields')
    } else {
      if (sched.contact.split('')[0] != '9' || sched.contact.length != 10) {
        setSuccess(false)
        setErrorMessage('Invalid contact number')
      } else {
        const timeCheck = await timeScheduleFilter([
          [sched.time.from, sched.time.to],
        ])
        if (timeCheck.success) {
          const fetchData = await dateScheduleFilter([sched.date])
          let reference = null

          if (sched.consultation == 'obgyne') {
            reference = fetchData[0].data?.obgyn_schedule || []
          } else {
            reference = fetchData[0].data?.midWife_schedule || []
          }

          let date = sched.date
          let temp = []
        
          // format the reference from datetime to time and preserve the status value
          for (let i of reference) {
            let from = moment(i.from).format('HH:mm')
            let to = moment(i.to).format('HH:mm')
            let status = i.status
            let username = i.username
            temp.push([from, to, status, username, i.schedID])
          }

          temp.push([
            moment(sched.time.from).format('HH:mm'),
            moment(sched.time.to).format('HH:mm'),
            false,
            sched.time.username,
            uid
          ])

          const postTimeCheck = await timeScheduleFilter(temp)
          let temp_schedule = []
          const result = timeScheduleFilter(temp)
          let final = {}

          if (postTimeCheck.success) {
            temp_schedule = sortSchedule(postTimeCheck?.data, date)

            if (sched.consultation == 'obgyne') {
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
                  data: {
                    ...fetchData[0].data,
                    midWife_schedule: temp_schedule,
                  },
                },
              ]
            }

            const res = await updateCalendarSchedule(
              fetchData[0],
              final[0].data
            )

            if (res) {
              const add_response = await addAppointment(sched)

              if (add_response.success) {

                
                setSuccess(true)

                await sendSmsNote({
                  patientName: sched.firstName + ' ' + sched.lastName,
                  date: moment(sched.date).format("MMMM DD, YYYY"),
                  timeslot: moment(sched.time.from).format("h:mm a")+' to '+moment(sched.time.to).format("h:mm a"),
                  contact: sched.contact,
                  cancellationCode: sched.cancellationCode,
                })

                setPriorityModal(false)

              } else {
                setSuccess(false)
                setErrorMessage(add_response.message)
              }
            } else {
              console.log(res)
            }
          } else {
            setSuccess(false)
            setErrorMessage(postTimeCheck.message)
          }
        } else {
          setSuccess(false)
          setErrorMessage(timeCheck.message)
        }
      }
    }

    setNotifBox(true)
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
        <div className="w-3/4 max-w-selectedDate rounded-md bg-white p-4">
          <p className="font-bold">Create priority schedule</p>
          {notifBox &&
            (success ? (
              <p className="bg-emerald-500 p-4 text-white">
                Added successfully !
              </p>
            ) : (
              <p className="bg-red-500 p-4 text-white">{errorMessage}</p>
            ))}
          <div className="align-center justify-content-center flex flex-row gap-x-4 py-2">
            <div className="gap-y-1">
              <p>First name</p>
              <input
                ref={firstName}
                className="my-2 mt-2 w-full rounded-md border border-inputBorder px-4 py-3"
              />
              <p>Last name</p>
              <input
                ref={lastName}
                className="my-2 mt-2 w-full rounded-md border border-inputBorder px-4 py-3"
              />

              <p>Date</p>
              <input
                min={moment().format('YYYY-MM-DD')}
                value={date}
                onChange={(e) =>
                  setDate(moment(e.target.value).format('YYYY-MM-DD'))
                }
                type="date"
                className="my-2 w-full rounded-md border border-inputBorder px-4 py-3"
              />
              <p>From</p>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                type="time"
                className="my-2 w-full rounded-md border border-inputBorder px-4 py-3"
              />
              <p>To</p>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                type="time"
                className="my-2 w-full rounded-md border border-inputBorder px-4 py-3"
              />
            </div>
            <div className="gap-y-1">
              <p>Contact Number</p>
              <input
                placeholder="9XXXXXXXXX"
                ref={contact}
                type="number"
                className="my-2 w-full rounded-md border border-inputBorder px-4 py-3"
              />
              <p>Address</p>
              <input
                ref={address}
                className="my-2 w-full rounded-md border border-inputBorder px-4 py-3"
              />
              <p>Concern</p>
              <input
                ref={concern}
                className="my-2 w-full rounded-md border border-inputBorder px-4 py-3"
              />
              <p>Health Professional</p>
              <select
                ref={username}
                className="my-2 w-full rounded-md border border-inputBorder px-4 py-3"
              >
                {workerUsers &&
                  workerUsers?.map((item, index) => (
                    <option key={item._id}>{item.username}</option>
                  ))}
              </select>
            </div>
            <p className="my-3"></p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => submit()}
              className="w-full rounded-md bg-primary px-4 py-2 text-white"
            >
              Okay
            </button>
            <button
              onClick={() => setPriorityModal(false)}
              className="w-full rounded-md bg-gray-100 px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreatePriority
