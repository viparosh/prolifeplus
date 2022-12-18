import React, { useState, useRef } from 'react'
import NoLayout from '../components/NoLayout'
import { useRouter } from 'next/router'
import { uploadLog } from '../services/log.services'
import Link from "next/link"
import moment from 'moment'
import { login } from '../services/user.services'

const Login = () => {
  const [error, setError] = useState()
  const usernameRef = useRef()
  const passwordRef = useRef()
  const router = useRouter()

  const submitHandler = async (e) => {
    e.preventDefault()
    const credentials = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    }

    const result = await login(credentials)

    if (result.data && result.data.role == "patient") {

      await uploadLog(
        { 
          username_FK: usernameRef.current.value,
          content: `${result.data.name} (${usernameRef.current.value}) has logged in`,
          category:"Patient - Login",
          role:result.data.role,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )

      router.push(`/patient/record`)
      setError('')
    } else {
      setError('Incorrect credentials')
    }
  }
  return (
    <NoLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-full lg:w-1/3 w-full flex-col items-center justify-center sm:px-20 px-8">
          <form
            className="flex w-full items-center justify-center"
            onSubmit={submitHandler}
          >
            <div className="flex w-full flex-col gap-4">
              <p className="text-2xl font-semibold text-slate-600">
                Patient Portal
              </p>
              {error && <p className="bg-red-500 p-4 text-white">{error}</p>}
              <input
                ref={usernameRef}
                className="mt-2 block w-full rounded-md border border-inputBorder p-3"
                type="text"
                placeholder="Username (9XXXXXXXXX)"
              />
              <input
                className="mt-2 block w-full rounded-md border border-inputBorder p-3"
                type="password"
                ref={passwordRef}
                placeholder="Password"
              />
              <button className="cursor-pointer rounded-md bg-primary p-3 text-white">
                Login
              </button>
            </div>
          </form>
          <div className="flex flex-col mt-4 gap-4 w-full">
            <Link href="/appointment">
            <button className=" w-full cursor-pointer rounded-md bg-gray-600 p-3 text-white">
              Create Appointment
            </button>
            </Link>
            <Link href="/cancellation/">
            <button className=" w-full cursor-pointer border border-gray-400 rounded-md bg-white p-3 text-gray-900">         
              Cancel Appointment           
            </button>
            </Link>
          </div>
        </div>
        <div className="lg:flex hidden h-full w-2/3 flex-col items-start justify-between bg-darkBlue py-10 px-9">
          <div>
            <p className="cursor-pointer text-3xl font-bold text-white">
              Blessed Hope Maternity Lying-in Clinic
            </p>
            <p className="font-light text-emerald-200">
              461 Ilang-Ilang St Bancal, 3020 Meycauayan, Philippines.
            </p>
          </div>
          <div className="px-4 flex gap-4 w-full justify-center">
            <img
              className="w-1/3 h-90"
              src="https://firebasestorage.googleapis.com/v0/b/mtathos-a572c.appspot.com/o/utilityImages%2Fhighlight1.png?alt=media&token=05486f0d-adc7-4ffc-af3e-e935d20dde5a"
            />
            <img
              className="w-1/3 h-90"
              src="https://firebasestorage.googleapis.com/v0/b/mtathos-a572c.appspot.com/o/utilityImages%2Fhighlight2.png?alt=media&token=ab2ec735-e09d-452b-a819-c023705d824a"
            />
            <img
              className="w-1/3 h-90"
              src="https://firebasestorage.googleapis.com/v0/b/mtathos-a572c.appspot.com/o/utilityImages%2Fhighlight3.png?alt=media&token=2bd5cdbb-69ac-46cf-b1c3-b7c806704df6"
            />
           
          </div>
          <div className="flex w-full items-center justify-around">
            <div className="flex w-1/3 flex-col items-center">
              <p className="font-semibold text-orange-300">Vision</p>
              <p className="text-justify indent-5 text-sm text-white">
                To become one of the most reliable lying-in clinic in our local
                area. We aim to help our patients have healthy and safe
                pregnancies.
              </p>
            </div>
            <div className="flex w-1/3 flex-col items-center">
              <p className="font-semibold text-teal-300">Mission</p>
              <p className="text-justify indent-5 text-sm text-white">
                At Blessed Hope Maternity Lying-in Clinic, our mission is to
                provide fast, reliable and caring services to pregnant patients
                and their babies.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-row justify-between">
            <p className="text-sm text-white">
              Email: blessedhopebancal@gmail.com
            </p>
            <p className="bg-red-500 text-sm text-white font-semibold p-2">Emergency Contact #: 0999161402</p>
          </div>
        </div>
      </div>
    </NoLayout>
  )
}

export default Login
