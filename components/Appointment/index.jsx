import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { AppointmentCard } from '../../components'
import { getSchedule, formatSchedule } from '../../services/schedule.services'

function Appointment() {
  const scheduleList = useRef()
  const [selectedData, setSelectedData] = useState()

  useEffect(async () => {
    const res = await getSchedule()

    if (res.success) {
      scheduleList.current = formatSchedule(res.data)
      setSelectedData(formatSchedule(res.data).schedules[0])
    }
  }, [])

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

export default Appointment
