import React from 'react'
import TimeLayout from './TimeLayout'

const ViewSelectedDates = ({ item }) => {
  return (
    <div>
      <p className="my-2 py-2">Midwife</p>
      <div className="ml-2 border-l border-dashed border-primary pl-6">
        {item.data ? (
          item.data.midWife_schedule?.length ? (
            item.data.midWife_schedule.map((date, index) => (
              <TimeLayout key={index} data={date} />
            ))
          ) : (
            <p className=" text-center text-slate-400">No Schedule</p>
          )
        ) : (
          <p className=" text-center text-slate-400">No Schedule</p>
        )}
      </div>
      <p className="my-2 py-2">Obgyn</p>
      <div className="ml-2 border-l border-dashed border-primary pl-6">
        {item.data ? (
          item.data.obgyn_schedule?.length ? (
            item.data?.obgyn_schedule.map((date, index) => (
              <TimeLayout key={index} data={date} />
            ))
          ) : (
            <p className=" text-center text-slate-400">No Schedule</p>
          )
        ) : (
          <p className=" text-center text-slate-400">No Schedule</p>
        )}
      </div>
    </div>
  )
}

export default ViewSelectedDates
