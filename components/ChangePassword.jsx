import React, { useState, useRef, useEffect } from 'react'
import { changePassword } from '../services/user.services'
import { uploadLog } from '../services/log.services'
import moment from 'moment'

const ChangePassword = ({authUser}) => {
  
  const [success,setSuccess] = useState(true)
  const [message,setMessage] = useState("")
  const password = useRef()
  const newPassword = useRef()
  const [modal, setModal] = useState(null)

  const changeModal = async() => {

    if(password.current.value.length == 0 
      || newPassword.current.value.length == 0){
      setSuccess(false)
      setMessage("Please fill all fields")
    }else{
      if(newPassword.current.value.length < 8){
        setSuccess(false)
        setMessage("Password minimum length should be 8")
      }else{

        const updatePassword = await changePassword(authUser._id,
          {
            oldPassword:password.current.value,
            password:newPassword.current.value
          })

        if(updatePassword.success){
          password.current.value = ''
          newPassword.current.value = ''
          setSuccess(true)

              
        await uploadLog(
          { 
            username_FK: authUser.username,
            content: `${authUser.name} ${(authUser.role == "patient") ? "("+authUser.username+")" : "(@"+authUser.username+")"} changed his/her password`,
            category:(authUser.role == "patient") ? "Patient - Change Password" : "Staff - Change Password",
            role:authUser.role,
            date:moment(Date.now()).format("MMMM DD, YYYY"),
            time:moment(Date.now()).format("h:mm a")
          }
        )

        }else{
          setSuccess(false)
          setMessage(updatePassword.message)
        }

      }  
    }

    setModal(true)
  }

  return (
    <div className="border-secondary rounded-md border px-4 py-4">
      <p>
        <b>Change password</b>
      </p>
      {modal && (
        (success) ?
        <p className='mt-4 bg-emerald-500 p-4 text-white'>
          Password has been changed
        </p>
        :
        <p className='mt-4 bg-red-500 p-4 text-white'>
          {message}
        </p>
      )}
      <div className="mt-5 flex flex-col gap-4">
        <div>
          <input
            ref={password}
            type="password"
            placeholder="Old password"
            className="w-full rounded-md border border-inputBorder px-4 py-3"
          />
        </div>
        <div>
          <input
            ref={newPassword}
            type="password"
            placeholder="New password"
            className="w-full rounded-md border border-inputBorder px-4 py-3"
          />
        </div>
        <button
          onClick={() => changeModal(true, 'Password has been changed.')}
          className=" w-full flex-shrink-0 rounded-md border bg-primary p-2 text-white"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default ChangePassword
