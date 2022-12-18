import React, { useState } from 'react'
import {
  weekdays,
  month,
  currentDay,
  nextMonth,
  startDays,
  renderDate,
} from '../../services/calendar.services'
import moment from 'moment'
const Calendar = ({ dates, setDates, usage, selectionMode }) => {
  const [currentMonth, setCurrentMonth] = useState(month)
  const setCalendar = (date, day) => {
    if (day >= currentDay || !currentMonth.active) {
      let temp_days = null
      if (selectionMode == 'many') {
        let ct = 0
        if (!dates.includes(date)) {
          temp_days = [...dates, date]
        } else {
          let temp = []
          while (ct < dates.length) {
            if (dates[ct] != date) {
              temp.push(dates[ct])
            }
            ct++
          }
          temp_days = temp
        }
      } else {
        temp_days = [date]
      }
      setDates(temp_days)
    }
  }
  const start = `gridColumn-${startDays(renderDate(1, currentMonth))}`
  return (
    <div className="border-secondary rounded-md border px-4 py-4">
      <div className="flex items-center justify-between py-4">
        <p className="text-lg font-semibold">{currentMonth.name}</p>
        <p className="text-lg font-semibold">{currentMonth.year}</p>
      </div>
      <div className="grid grid-cols-7 place-items-center">
        {weekdays.map((item) => (
          <span key={item} className="mb-2 text-center text-xs">
            {item}
          </span>
        ))}
        {currentMonth.numberOfDays.map((item) => (
          <div
            className={`${item == 1 ? start : ''} flex flex-col`}
            key={renderDate(item, currentMonth)}
          >
            <button
              className={`${
                moment(renderDate(item, currentMonth)).format('ddd') == 'Sun'
                  ? 'bg-red-500 text-white transition-colors delay-100'
                  : dates.includes(renderDate(item, currentMonth))
                  ? 'bg-primary text-white'
                  : 'text-secondaryText hover:bg-slate-200'
              }  duration-400 m-1 inline-block h-10 w-10 cursor-pointer rounded-full p-2 text-center text-white transition-colors`}
              onClick={() =>
                moment(renderDate(item, currentMonth)).format('ddd') != 'Sun' &&
                setCalendar(renderDate(item, currentMonth), item)
              }
            >
              {item}
            </button>
          </div>
        ))}
      </div>
      {usage == 'admin' && (
        <button
          className="mt-4 w-full rounded-md bg-slate-200 p-2 "
          onClick={() =>
            currentMonth.active
              ? setCurrentMonth(nextMonth)
              : setCurrentMonth(month)
          }
        >
          {currentMonth.active ? 'Next Month' : 'Previous Month'}
        </button>
      )}
    </div>
  )
}

export default Calendar
