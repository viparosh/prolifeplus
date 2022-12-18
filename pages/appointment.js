import React, { useRef, useState, useEffect } from 'react'
import Head from 'next/head'
import moment from 'moment'
import { Calendar } from '../components'
import { dateScheduleFilter } from '../services/calendar.services'
import {
  checkExistingAppointment,
  sendSmsNote,
  addAppointment,
  checkExpiration,
  checkVerificationCode,
  idChecker,
  updateSchedule,
} from '../services/appointment.services'
import { getSchedule } from '../services/schedule.services'


function appointment() {
  const cancelCodeRef = useRef()
  const mode = ['midwife', 'obgyne']
  const formattedTimeslot = useRef()
  const formattedDate = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const contactRef = useRef()
  const codeRef = useRef()
  const addressRef = useRef()
  const concernRef = useRef()
  const timeRef = useRef('none')
  const dateRef = useRef()
  const [dates, setDates] = useState([])
  const [consultation, setConsultation] = useState(mode[0])
  const [fetchData, setFetchData] = useState()
  const [errors, setErrors] = useState({})
  const [submitOnProgress, setSubmitOnProgress] = useState(false)
  const [success, setSuccess] = useState(false)
  const [timer, setTimer] = useState({ active: false, value: 0 })
  const mounted = useRef()
  const prevStateDates = useRef()
  const prevStateConsultation = useRef()
  const timeRange = useRef([])
  const [modal, setModal] = useState(false)
  const [sampleTimer,setSampleTimer] = useState(0)
  
  const triggerTime = async() => {
    if (contactRef.current.value.length != 10 || contactRef.current.value[0] != 9) {
      setErrors({ ...errors, contactError: 'Invalid mobile number' })
    }else{
      setErrors({ ...errors, contactError: '' })
    
      if (sampleTimer == 0) {
        const expiration = await checkExpiration(contactRef.current.value)
        
        var sec = 10
          setInterval(() => {
            if(sec >= 0){
              setSampleTimer(sec)
              sec--;
            }
        },1000)

        
      }
    }
  }

  const [toolTip, setToolTip] = useState(false)

  const updateTime = () => {
    let index = timeRef.current?.value
    let reference = timeRange.current?.value

    let new_value = reference[index]
    new_value.status = false

    reference[index] = new_value
    let final_value = {}
    if (consultation == 'midwife') {
      final_value.midWife_schedule = reference
    } else {
      final_value.obgyn_schedule = reference
    }
    return final_value
  }

  useEffect(() => {
    const load = async () => {
      if (
        dates != prevStateDates.current ||
        consultation != prevStateConsultation.current
      ) {
        const response = await dateScheduleFilter(dates)
        if (consultation == mode[0]) {
          timeRange.current.value = response[0]?.data?.midWife_schedule || []
        } else {
          timeRange.current.value = response[0]?.data?.obgyn_schedule || []
        }
        timeRange.current.value = timeRange.current.value.filter(
          (tr) =>
            moment(tr.to).format('YYYY-MM-DD HH:mm') >
            moment().clone().format('YYYY-MM-DD HH:mm')
        )

        if (response[0]?.data !== null) {
          dateRef.current = response[0]?.data.date
        } else {
          dateRef.current = undefined
        }
        setFetchData(response)
      }
    }
    load()
    mounted.current = true
    prevStateDates.current = dates
    prevStateConsultation.current = consultation
  }, [timer, errors, dates, consultation])

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
  
  const verifyHandler = async () => {
    const schedules = await getSchedule()
    const filter = schedules?.data?.schedules.filter(
      (sched) =>
        sched.contact == contactRef.current.value && sched.status == 'pending'
    )
    // check if contact already exist in current month
    if (filter.length > 0) {
      const checkerFlag =
        moment().format('YYYY-MM-DD') >
        moment(filter[0].time.to).format('YYYY-MM-DD')
      if (checkerFlag) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }
  const submitHandler = async () => {
    let cancelCode = generateString(5)
    let serverCancelCode = generateString(5)
    let extraError = {}

    cancelCodeRef.current = cancelCode
    // verification code value
    const code = codeRef.current.value

    // gather all fields value
    const newData = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      contact: contactRef.current.value,
      address: addressRef.current.value,
      concern: concernRef.current.value,
      time: timeRange.current.value
        ? timeRange.current.value[timeRef.current.value]
        : undefined,
      date: dateRef.current,
      consultation: consultation,
      monthYear: moment().format('MMMM-YYYY'),
      cancellationCode: cancelCode,
      serverCancellationCode: serverCancelCode
    }

    // check verification code
    const code_result = await checkVerificationCode(newData.contact, code)

    // doing validation for contact and verification
    if (code.length == 0) {
      extraError.codeError = 'Code is required'
    } else if (!code_result) {
      extraError.codeError = 'Wrong Verification Code !'
    }

    //One number , one appointment
    const numberCheck = await checkExistingAppointment({contact:newData.contact})
    if(numberCheck.success == false){
      extraError.contactError = 'You have already an existing appointment'
    }
    //end of process


    if (firstNameRef.current.value == 0) {
      extraError.firstNameError = 'Missing field'
    }
    if (lastNameRef.current.value == 0) {
      extraError.lastNameError = 'Missing field'
    }
    if (concernRef.current.value == 0) {
      extraError.concernError = 'Missing field'
    }
    if (addressRef.current.value == 0) {
      extraError.addressError = 'Missing field'
    }
    if (newData.contact.length != 10 || newData.contact[0] != 9) {
      extraError.contactError = 'Invalid mobile number'
    }
    if (newData.time == undefined) {
      extraError.timeError = 'Missing field'
    }
    if (newData.date == undefined) {
      extraError.dateError = 'Missing field'
    }

    if (newData.date != undefined && newData.time != undefined) {
      var dt = newData.date.toString().split('T')
      var nd = new Date(dt).toString().split(' ')
      formattedDate.current = nd[1] + ' ' + nd[2] + ', ' + nd[3]
      formattedTimeslot.current =
        ' from ' +
        moment(newData.time.from).format('hh:mm A') +
        ' to ' +
        moment(newData.time.to).format('hh:mm A')
    }

    //check if error has no value ? save : display error
    const isEmpty = Object.keys(extraError).length === 0
    if (isEmpty) {
      console.log(await verifyHandler())
      if (await verifyHandler()) {
        setModal(false)
        setSubmitOnProgress(true)
        setTimeout(async () => {
          let time_result = false
          const time_checker = await dateScheduleFilter(dates)
          // validation if time is available or not
          if (consultation == mode[0]) {
            time_result = idChecker(
              time_checker[0].data.midWife_schedule,
              newData.time._id
            )
          } else {
            time_result = idChecker(
              time_checker[0].data.obgyn_schedule,
              newData.time._id
            )
          }
          if (time_result) {
            const add_response = await addAppointment(newData)
            if (add_response.data) {
              const update_response = await updateSchedule(
                fetchData[0].date,
                updateTime()
              )
              if (update_response) {
                const confirmation = await sendSmsNote({
                  patientName: newData.firstName + ' ' + newData.lastName,
                  date: formattedDate.current,
                  timeslot: formattedTimeslot.current,
                  contact: newData.contact,
                  cancellationCode: newData.cancellationCode,
                })
                setSuccess(true)
              } else {
                setSuccess(false)
              }
            } else {
              setErrors({ ...add_response.error })
            }
          } else {
            extraError.dateError = 'Please choose another date'
          }
          setSubmitOnProgress(false)
          // setErrors(extraError)
        }, 2000)
      } else {
        setModal(true)
      }
    } else {
      setErrors(extraError)
    }
  }

  return (
    <div>
      <Head>
        <title>Blessed Hope Maternity Clinic</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap"
        />
      </Head>
      {success ? (
        <div className="m-auto min-h-screen lg:flex lg:items-center lg:justify-center">
          <div className="rounded-md bg-white p-6 text-center drop-shadow-2xl lg:p-16">
            <h3 className="py-3 text-3xl font-semibold">
              Appointment Form Submitted!
            </h3>
            <p className="mb-5 text-secondaryText">
              Your schedule is {formattedDate.current}{' '}
              {formattedTimeslot.current}
            </p>
            <p className="text-secondaryText">
              To cancel apppointment , visit the official patient website
            </p>
            <p className="text-secondaryText">
              and use your cancellation code:{' '}
              <span className="text-red-700">{cancelCodeRef.current}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="m-auto min-h-screen lg:flex lg:items-center lg:justify-center">
          <div className="rounded-md bg-white p-6 drop-shadow-2xl lg:p-16">
            <h3 className="py-3 text-3xl font-semibold">
              Blessed Hope Maternity and Lying-in Clinic
            </h3>
            <h3 className="py-3 text-2xl">Appointment Form</h3>

            <div className="grid gap-5 lg:auto-cols-max lg:grid-flow-col lg:gap-10">
              <div>
                <div className="flex flex-col items-end lg:flex-row">
                  <div className="mt-4 w-full lg:mr-4">
                    <span className="text-sm text-red-600">
                      {errors?.firstNameError}
                    </span>
                    <label htmlFor="fname" className="block text-secondaryText">
                      First Name
                    </label>
                    <input
                      required
                      ref={firstNameRef}
                      type="text"
                      id="fname"
                      className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
                    />
                  </div>
                  <div className="mt-4 w-full">
                    <span className="text-sm text-red-600">
                      {errors?.lastNameError}
                    </span>
                    <label htmlFor="lname" className="block text-secondaryText">
                      Last Name
                    </label>
                    <input
                      required
                      ref={lastNameRef}
                      type="text"
                      id="lname"
                      className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end lg:flex-row">
                  <div className="mt-4 w-full">
                    <span className="text-sm text-red-600">
                      {errors?.contactError}
                    </span>
                    <label
                      htmlFor="contact"
                      className="block text-secondaryText"
                    >
                      Contact Number
                    </label>
                    <div className="relative ">
                      <span className="absolute top-contactFix  left-4 block text-slate-400">
                        +63
                      </span>
                      <input
                        required
                        ref={contactRef}
                        placeholder="9XXXXXXXXX"
                        type="number"
                        id="contact"
                        className="mt-2 w-full rounded-md border border-inputBorder px-3 py-2 pl-12"
                      />
                    </div>
                  </div>
                  <div className="mt-4 w-full lg:ml-4">
                    <span className="text-sm text-red-600">
                      {errors?.codeError}
                    </span>
                    <label htmlFor="code" className="block text-secondaryText">
                      Verification Code
                    </label>
                    <div className="flex items-center">
                      <input
                        required
                        ref={codeRef}
                        type="number"
                        id="code"
                        className="mt-2 w-full rounded-md rounded-r-none border border-inputBorder px-3 py-2"
                      />
                      <button
                        onClick={triggerTime}
                        className="mt-2 min-w-requestBtn rounded-md  rounded-l-none border border-primaryBtnBorder bg-primaryBtn px-4 py-2 text-white "
                      >
                        {sampleTimer == 0 ? 'Request' : sampleTimer}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full">
                  <span className="text-sm text-red-600">
                    {errors?.addressError}
                  </span>
                  <label htmlFor="address" className="block text-secondaryText">
                    Address
                  </label>
                  <textarea
                    required
                    ref={addressRef}
                    type="text"
                    id="address"
                    rows={3}
                    className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
                  />
                </div>
                <div className="mt-4 w-full">
                  <span className="text-sm text-red-600">
                    {errors?.concernError}
                  </span>
                  <label htmlFor="concern" className="block text-secondaryText">
                    Concern
                  </label>
                  <textarea
                    required
                    ref={concernRef}
                    type="text"
                    id="concern"
                    rows={3}
                    className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
                  />
                </div>
              </div>
              <div className=" border-inputBorder lg:border-l lg:pl-10">
                <div className="mb-4">
                  <div className="item-center relative flex justify-between">
                    <label
                      htmlFor="consultation"
                      className="block text-secondaryText"
                    >
                      Consultation Type
                    </label>
                    <button
                      onMouseEnter={() => setToolTip(true)}
                      onMouseLeave={() => setToolTip(false)}
                      className="h-6 w-6 rounded-full bg-gray-500 text-white"
                    >
                      ?
                    </button>
                    <div
                      className={`absolute top-7 rounded-md bg-gray-500 p-3 text-sm text-white ${
                        !toolTip ? 'hidden' : ''
                      }`}
                    >
                      <ul>
                        <li>Midwife - normal check-up</li>
                        <li>
                          OB-Gyne - for patient with highblood,goiter,asthma, or
                          diabetes.
                        </li>
                        <li>Red date - No service</li>
                      </ul>
                    </div>
                  </div>
                  <select
                    onChange={(e) => {
                      setConsultation(e.target.value)
                    }}
                    id="consultation"
                    className="mt-2 block w-full rounded-md border border-inputBorder bg-white px-3 py-2"
                  >
                    <option value={mode[0]}>MidWife</option>
                    <option value={mode[1]}>OB-Gyne</option>
                  </select>
                </div>
                <span className="text-sm text-red-600">
                  {errors?.dateError}
                </span>
                <label
                  htmlFor="fname"
                  className="mb-2 block text-secondaryText"
                >
                  Date
                </label>
                <Calendar setDates={setDates} dates={dates} />
                <div className="mt-4 mr-4 w-full">
                  <span className="text-sm text-red-600">
                    {errors?.timeError}
                  </span>
                  <label htmlFor="fname" className="block text-secondaryText">
                    Time
                  </label>
                  <select
                    defaultValue={timeRef.current.value}
                    ref={timeRef}
                    className="mt-2 block w-full rounded-md border border-inputBorder bg-white px-3 py-2"
                  >
                    <option value="none" disabled>
                      -- Select Time --
                    </option>
                    {timeRange.current.value?.map(
                      (item, index) =>
                        item.status && (
                          <option value={index} key={index}>
                         
                            {moment(item.from).format('hh:mm A')} -{' '}
                            {moment(item.to).format('hh:mm A - ')} 
                    
                            {item.name}
                     
                          </option>
                        )
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-end">
              {submitOnProgress ? (
                <p className="ml-4 rounded-md  bg-white px-4 py-2 text-secondaryText ">
                  &nbsp; Submitting...
                </p>
              ) : (
                <button
                  onClick={submitHandler}
                  className="ml-4 rounded-md  bg-primaryBtn px-4 py-2 text-white "
                >
                  Submit Form
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default appointment
