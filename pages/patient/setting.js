import React, { useState , useEffect } from 'react'
import { ChangePassword } from '../../components'
import Layout from '../../components/Layout'
import Link from "next/link"
import { getUser } from '../../services/user.services'

const settings = () => {	
  
  const [authUser, setAuthUser] = useState()

  useEffect(async() => {
    const user = await getUser()
    
    if(user.success){
      setAuthUser(user.data)
    }

  },[])

  return (
    <Layout title="Account Settings" role="Patient">
      <div className="flex flex-row gap-x-5">
        <div className="w-1/2">
          <ChangePassword authUser={authUser} role="Patient" />
        </div>
        <div className="w-1/2 border-secondary rounded-md border px-4 py-4">
          <p>
            <b>Patient Tools</b>
          </p>
          <p className="text-slate-900 my-4 text-justify text-sm ">You can create and cancel your appointment by clicking these buttons. It is better to use your phone number 
            <span className="text-green-900 font-semibold">
              {' ('+authUser?.username+')'}
            </span> when creating transaction
          </p>
          <div className="flex flex-row gap-x-4">
            <Link href="/appointment">
              <button className="w-full cursor-pointer rounded-md bg-gray-600 p-2 text-white text-sm ">
                Create Appointment
              </button>
            </Link>
            <Link href="/cancellation/">
              <button className=" w-full cursor-pointer border border-gray-400 rounded-md bg-white p-2 text-sm text-gray-900">         
                Cancel Appointment           
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default settings
