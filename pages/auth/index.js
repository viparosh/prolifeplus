import React, { useState, useRef } from 'react'
import NoLayout from '../../components/NoLayout'
import { useRouter } from 'next/router'
import { login } from '../../services/user.services'
import { uploadLog } from '../../services/log.services'
import moment from 'moment'

const Login = () => {
  const [error, setError] = useState()
  const usernameRef = useRef()
  const passwordRef = useRef()
  const router = useRouter()

  const [showPassword,setShowPassword] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    const credentials = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    }

    const result = await login(credentials)

    if (result.data && result.data.role != "patient") {
      
      await uploadLog(
        { 
          username_FK: usernameRef.current.value,
          content: `${result.data.name} (@${usernameRef.current.value}) has logged in`,
          category:"Staff - Login",
          role:result.data.role,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )

      router.push(`/${result.data.role}`)

      setError('')
    } else {
      setError('Incorrect credentials')
    }
  }

  return (
    <NoLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="md:flex w-full p-5 hidden flex-col items-center justify-center h-full bg-darkBlue">
          <img
            className="h-64"
            src="https://firebasestorage.googleapis.com/v0/b/mtathos-a572c.appspot.com/o/utilityImages%2Fprolife.png?alt=media&token=bc3a1c92-c458-4b05-90f7-175211ba28a2"
            />
          <p className="mt-2 mb-3 text-3xl font-bold text-white">ProLife+</p>
          <p className="my-1 text-lg text-white">Blessed Hope Maternity Lying-in Clinic</p>
          <p className="mb-1 text-base font-light text-white">Information System</p>
    
        </div>
        <div className="flex justify-center items-center w-full">
        <form className="w-[40rem]" onSubmit={submitHandler}>
          <div className="items-center w-full flex flex-col gap-4 rounded-md p-8">
            <p className="text-2xl font-medium text-slate-600">
              Welcome back !
            </p>
            <p className="mb-5 text-sm text-gray-500">Fill up the information then start working with confidence. Do not forget to smile ;--)</p>
            <input
              ref={usernameRef}
              className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-3"
              type="text"
              placeholder="Username"
            />
            <div className="flex mt-1 w-full border border-inputBorder">
              <input
                className="rounded-md w-full px-3 py-3"
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                placeholder="Password"
              />
              <button onClick={(e) => {
                e.preventDefault()
                setShowPassword(!showPassword)
              }} className="text-sm bg-gray-700 text-white px-2 w-16">
                Show
              </button>
            </div>
            <button className="w-full cursor-pointer rounded-md bg-primary py-3  px-4 text-white">
              Login
            </button>
            {error && <p className="w-full rounded-md border text-sm text-center bg-red-500 p-2 text-white">{error}</p>}
          </div>
        </form>
        </div>
      </div>
    </NoLayout>
  )
}

export default Login
