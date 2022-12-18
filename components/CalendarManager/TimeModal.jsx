import React, { useRef, useState } from 'react'
import {
  sortSchedule,
  timeScheduleFilter,
} from '../../services/calendar.services'
import moment from 'moment'
const TimeModal = ({ modalClose, modal, setFetchData, fetchData }) => {
  const [error, setError] = useState(null)
  const fromRef = useRef()
  const toRef = useRef()

  const validateHandler = () => {
    if (fromRef.current.value && toRef.current.value) {
      let reference = null
      if (modal.root == 'obg') {
        reference = fetchData[0].data?.obgyn_schedule || []
      } else {
        reference = fetchData[0].data?.midWife_schedule || []
      }
      let date = moment(modal.date).format('YYYY-MM-DD')
      let temp_schedule = []
      const data = {
        from: fromRef.current.value,
        to: toRef.current.value,
      }
      let temp = []

      // format the reference from datetime to time and preserve the status value
      for (let i of reference) {
        let from = moment(i.from).format('HH:mm')
        let to = moment(i.to).format('HH:mm')
        let status = i.status
        temp.push([from, to, status])
      }
      temp.push([data.from, data.to, true])
      const result = timeScheduleFilter(temp)
      if (result.success) {
        temp_schedule = sortSchedule(result.data, date)
        console.log('result', temp_schedule)
        if (modal.root == 'obg') {
          setFetchData([
            {
              ...fetchData[0],
              data: { ...fetchData[0].data, obgyn_schedule: temp_schedule },
            },
          ])
        } else {
          setFetchData([
            {
              ...fetchData[0],
              data: { ...fetchData[0].data, midWife_schedule: temp_schedule },
            },
          ])
        }
      }
      setError(result)
    } else {
      setError({
        success: false,
        message: 'Please select time first to validate the input',
      })
    }
  }
  return !modal.status ? (
    <div className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-6 lg:min-w-timeModal">
        <p className="text-xl font-semibold">
          {modal.default_value ? 'Update Time Slot' : 'Add Time Slot'}
        </p>
        {error && (
          <p
            className={`my-4 rounded-md ${
              !error?.success ? 'bg-red-500 ' : 'bg-emerald-500'
            }  px-4 py-2 text-white`}
          >
            {error?.message}
          </p>
        )}
        <div className="my-2 flex items-center justify-between">
          <label htmlFor="fromTime">From:</label>
          <input
            ref={fromRef}
            type="time"
            defaultValue={
              modal.default_value &&
              moment(modal.default_value.from).format('HH:mm')
            }
            id="fromTime"
            className="mt-2 block cursor-pointer rounded-md border border-inputBorder bg-white px-3 py-2"
          />
        </div>
        <div className="my-2 flex items-center justify-between">
          <label htmlFor="toTime">To:</label>
          <input
            ref={toRef}
            type="time"
            defaultValue={
              modal.default_value &&
              moment(modal.default_value.to).format('HH:mm')
            }
            id="toTime"
            className="mt-2 block cursor-pointer rounded-md border border-inputBorder bg-white px-3 py-2"
          />
        </div>
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={() => {
              setError('')
              modalClose({ status: true, data: null })
            }}
            className=" mx-2 ml-0 rounded-md border p-2 px-4"
          >
            Cancel
          </button>
          <button
            onClick={validateHandler}
            className=" mx-2 ml-0 rounded-md border bg-primary p-2 px-4 text-slate-100"
          >
            Validate and Save
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default TimeModal
