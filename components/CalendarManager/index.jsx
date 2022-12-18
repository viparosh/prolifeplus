import React, { useState, useEffect, useRef } from 'react'
import CreatePriority from '../CustomModal/CreatePriority'
import Layout from '../../components/Layout'

import { dateScheduleFilter } from '../../services/calendar.services'
import moment from 'moment'
import {
  Calendar,
  TimeModal,
  ViewSelectedDates,
  ModifySelectedDates,
} from '../../components'
const calendar = ({ showOnly }) => {
  const mode = ['view', 'modify']
  const [modalPriority, setModalPriority] = useState(false)
  const [selection, setSelection] = useState(mode[0])
  // async data
  const [fetchData, setFetchData] = useState([])
  // selected dates from calendar
  const [dates, setDates] = useState([])
  const clone_fetchData = useRef()
  const mounted = useRef()
  const [timeSlotModal, setTimeSlotModal] = useState({
    status: true,
    date: null,
    default_value: null,
    root: '',
  })

  const setAction = (e) => {
    setSelection(e.target.value)
  }

  useEffect(() => {
    const load = async () => {
      const response = await dateScheduleFilter(dates)
      clone_fetchData.current = response
      setFetchData(response)
    }
    if (mounted.current) {
      load()
    }
    mounted.current = true
  }, [dates, selection])
  return (
    <>
      {modalPriority ? (
        <CreatePriority setModalPriority={setModalPriority} />
      ) : (
        <></>
      )}
      <TimeModal
        modalClose={setTimeSlotModal}
        modal={timeSlotModal}
        fetchData={fetchData}
        setSelection={setSelection}
        setFetchData={setFetchData}
      />
      <div className="grid items-start gap-5 xl:grid-flow-col xl:gap-10">
        <div className="flex flex-col-reverse lg:top-94px xl:sticky  ">
          <Calendar
            usage="admin"
            selectionMode={selection}
            dates={dates}
            setDates={setDates}
          />
        </div>
        <div className="mb-4 box-border min-h-selectedDate min-w-selectedDate rounded-md border p-4 xl:max-w-selectedDate">
          {/* <p className="block text-secondaryText">Choose Action:</p> */}
          {/* <select
            value={selection}
            onChange={setAction}
            className="my-2 block w-full cursor-pointer rounded-md border border-inputBorder bg-white px-3 py-2"
          >
            <option value={mode[0]}>View Schedule</option>
            {!showOnly && <option value={mode[1]}>Modify Schedule</option>}
          </select> */}
          {/* <p className="mt-4 block text-secondaryText"></p> */}

          <div>
            {fetchData.length ? (
              <div className="mt-4">
                <p className="font-semibold text-secondaryText">
                  Selected Date:{' '}
                  {moment(fetchData[0].date).format('MMMM DD, YYYY')}
                </p>
                <div>
                  {selection == mode[0] ? (
                    <ViewSelectedDates
                      item={fetchData[0]}
                      setItem={setFetchData}
                    />
                  ) : (
                    <ModifySelectedDates
                      item={fetchData[0]}
                      setItem={setFetchData}
                      modalClose={setTimeSlotModal}
                      modal={timeSlotModal}
                      cloneItem={clone_fetchData.current[0]}
                      setSelection={setSelection}
                    />
                  )}
                </div>
              </div>
            ) : (
              <p className="pt-10 text-center text-slate-400">
                Pick a date to start
              </p>
            )}
          </div>
        </div>
      </div>
      {/*<button onClick={() => setModalPriority(true)}className="mb-4 bg-primary text-white px-5 py-2 rounded-md my-5">Emergency schedule</button>*/}
    </>
  )
}

export default calendar
