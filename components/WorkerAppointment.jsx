import React, { useEffect, useRef, useState } from 'react'
import { getUser } from '../services/user.services'
import { formatSchedule, getMySchedule } from '../services/schedule.services'
import moment from 'moment'
import AppointmentCard from './Appointment/AppointmentCard'

const WorkerAppointment = () => {
  const mounted = useRef()
  const scheduleList = useRef()
  const [selectedData, setSelectedData] = useState()

  useEffect(() => {
    let isCancelled = false
    const load = async () => {
      mounted.current = true
      const userRes = await getUser()
      if (!isCancelled) {
        if (userRes.success) {
          const res = await getMySchedule(userRes.data.username)

          if (res.success) {
            scheduleList.current = formatSchedule(res.data)
            setSelectedData(formatSchedule(res.data).schedules[0])
          }
        }
      }
    }

    if (!mounted.current) {
      load()
    }
    return () => {
      isCancelled = true
    }
  })

  return (
    <>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="p-2 text-2xl font-semibold text-primary">
            {scheduleList.current?.monthYear.split('-')[0]}
          </p>
          <p className="p-2 text-xl font-semibold text-secondaryText">
            {scheduleList.current?.monthYear.split('-')[1]}
          </p>
        </div>
        <div className="flex">
          <div>
            {scheduleList.current?.schedules.map((item, index) => (
              <p
                className={`mb-4 flex h-20 w-20 cursor-pointer flex-col items-center rounded-3xl ${
                  item.day == selectedData?.day
                    ? 'bg-primary text-white'
                    : 'bg-lightGray text-secondaryText'
                } p-4 text-2xl `}
                onClick={() => setSelectedData(item)}
                key={index}
              >
                <span className="text-sm">
                  {moment(item.schedule[0].date).format('ddd')}
                </span>
                {item.day}
              </p>
            ))}
          </div>

          <AppointmentCard
            schedules={selectedData}
            setSelected={setSelectedData}
          />
        </div>
      </div>
    </>
  )
}

export default WorkerAppointment
