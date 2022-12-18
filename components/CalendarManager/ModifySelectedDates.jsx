import React, { useState, useEffect } from 'react'
import { updateCalendarSchedule } from '../../services/calendar.services'
import TimeLayout from './TimeLayout'

const ModifySelectedDates = ({
  item,
  setItem,
  modalClose,
  cloneItem,
  setSelection,
}) => {
  const saveHandler = async () => {
    let newData = {}
    newData.midWife_schedule = item.data?.midWife_schedule || []
    newData.obgyn_schedule = item.data?.obgyn_schedule || []

    const result = updateCalendarSchedule(cloneItem, newData)
    result ? setSelection('view') : console.log('display error')
  }
  const [save, setSave] = useState(false)
  useEffect(() => {
    if (item.data === cloneItem.data) {
      setSave(false)
    } else {
      setSave(true)
    }
  }, [item])

  // delete handler
  const midwifeRemoveHandler = (id) => {
    let ob_data = item.data.obgyn_schedule
    let md_data = item.data.midWife_schedule
    md_data.splice(id, 1)

    let final =
      md_data.length == 0 && (ob_data?.length == 0 || !ob_data)
        ? null
        : {
            ...item.data,
            obgyn_schedule: ob_data,
          }
    setItem([
      {
        ...item,
        data: final,
      },
    ])
  }
  const obgynRemoveHandler = (id) => {
    let ob_data = item.data.obgyn_schedule
    let md_data = item.data.midWife_schedule
    ob_data.splice(id, 1)
    let final =
      ob_data.length == 0 && (md_data?.length == 0 || !md_data)
        ? null
        : {
            ...item.data,
            obgyn_schedule: ob_data,
          }
    setItem([
      {
        ...item,
        data: final,
      },
    ])
  }
  return (
    <div>
      <p className="my-2 py-2">Midwife</p>
      <div className="ml-2 border-l border-dashed border-primary pl-6">
        {item.data &&
          item.data?.midWife_schedule?.map((date, index) => (
            <TimeLayout
              key={index}
              data={date}
              removeId={index}
              actionButton={true}
              removeHandler={midwifeRemoveHandler}
              modalClose={() =>
                modalClose({
                  status: false,
                  date: item.date,
                  default_value: { from: date.from, to: date.to, index: index },
                  root: 'mid',
                })
              }
            />
          ))}
        <button
          onClick={() =>
            modalClose({
              status: false,
              date: item.date,
              default_value: null,
              root: 'mid',
            })
          }
          className=" mx-2 ml-0 w-full rounded-md border px-3 py-2"
        >
          Add Slot
        </button>
      </div>
      <p className="my-2 py-2">Obgyn</p>
      <div className="ml-2 border-l border-dashed border-primary pl-6">
        {item.data &&
          item.data?.obgyn_schedule?.map((date, index) => (
            <TimeLayout
              key={index}
              data={date}
              removeId={index}
              actionButton={true}
              removeHandler={obgynRemoveHandler}
              modalClose={() =>
                modalClose({
                  status: false,
                  date: item.date,
                  default_value: { from: date.from, to: date.to, index: index },
                  root: 'obg',
                })
              }
            />
          ))}
        <button
          onClick={() =>
            modalClose({
              status: false,
              date: item.date,
              default_value: null,
              root: 'obg',
            })
          }
          className=" mx-2  ml-0 w-full rounded-md border px-3 py-2"
        >
          Add Slot
        </button>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setSelection('view')}
          className="mx-2 ml-0 rounded-md border p-2 px-4"
        >
          Cancel
        </button>
        {save ? (
          <button
            onClick={saveHandler}
            className="mx-2 ml-0 rounded-md border bg-primary p-2 px-4 text-slate-100"
          >
            Save Changes
          </button>
        ) : (
          <p className="mx-2 ml-0 rounded-md border p-2 px-4">Save Changes</p>
        )}
      </div>
    </div>
  )
}

export default ModifySelectedDates
