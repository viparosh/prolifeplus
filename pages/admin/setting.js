import React, { useState, useRef , useEffect} from 'react'
import { addUser } from '../../services/user.services'
import Layout from '../../components/Layout'
import { ChangePassword , ChangeProfile } from '../../components'
import { getUser } from '../../services/user.services'
import moment from 'moment'
import { uploadLog } from '../../services/log.services'

function setting() {

  const [profile,setProfile] = useState()
  const accUser = useRef()
  const accName = useRef()
  const accPassword = useRef()
  const accRole = useRef()
  const [error, setError] = useState()
  const [status, setStatus] = useState()
  const [authUser, setAuthUser] = useState()
  const [profileModal,setProfileModal] = useState()

  useEffect(async() => {
    const user = await getUser()
    
    if(user.success){
      setAuthUser(user.data)
    }

  },[])


  const changeModal = async () => {
    const newData = {
      username: accUser.current?.value,
      name: accName.current?.value,
      password: accPassword.current?.value,
      role: accRole.current?.value,
    }

    const user_add = await addUser({
      username: newData.username,
      profileLink:'https://firebasestorage.googleapis.com/v0/b/mtathos-a572c.appspot.com/o/utilityImages%2Fleviticus16bec4ed-03b0-46d3-8631-23709154e930%2062dfa0cc088e3aa27935cc6a?alt=media&token=d9f994bb-c5fc-45b4-ac30-2ef44caab018',
      name: newData.name,
      password: newData.password,
      patientID: '',
      role: newData.role,
    })

    if (!user_add.success) {
      setError(user_add.error)
      setStatus(false)
    } else {
      
      await uploadLog(
        { 
          username_FK: authUser.username,
          content: `${authUser.name} (@${authUser.username}) added 
              ${newData.name} (@${newData.username}) as ${newData.role}`,
          category:"Add Staff Account",
          role:authUser.role,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )

      setError('')
      accUser.current.value = ""
      accName.current.value = ""
      accPassword.current.value = ""
      setStatus(true)
    }
  }

  const updateProfile = (url) => {
    setProfile(url)
  }

  return (
    <Layout profile={profile} title="Account Settings" role="Admin">
      {profileModal ? <ChangeProfile role="Worker" updateProfile={updateProfile} closeModal={setProfileModal} authUser={authUser} /> : <></>}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ChangePassword authUser={authUser}/>
        <div className="border-secondary rounded-md border px-4 py-4">
          <p>
            <b>Add account</b>
          </p>
          {status && (
              <p className="mt-4 bg-emerald-500 p-4 text-white">
                Account successfully created!
              </p>
            )}
          {error && <p className="mt-4 bg-red-500 p-4 text-white">{error}</p>}
          <div className="mt-5 flex flex-col gap-4">
            <div>
              <input
                ref={accUser}
                placeholder="Username"
                className=" w-full  rounded-md border border-inputBorder px-4 py-3"
              />
            </div>
            <div>
              <input
                ref={accName}
                placeholder="Name"
                className=" w-full  rounded-md border border-inputBorder px-4 py-3"
              />
            </div>
            <div>
              <input
                ref={accPassword}
                type="password"
                placeholder="Password"
                className="w-full rounded-md border border-inputBorder px-4 py-3"
              />
            </div>
            <div className=" rounded-md border">
              <select
                ref={accRole}
                className=" w-full  rounded-md border border-inputBorder px-4 py-3"
              >
                <option value="obgyne">OB-Gyne</option>
                <option value="midwife">Midwife</option>
                <option value="secretary">Secretary</option>
              </select>
            </div>
            <button
              onClick={changeModal}
              className="w-full flex-shrink-0 rounded-md border bg-primary p-2 text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-secondary rounded-md border px-4 py-4">
          <p>
            <b>Change profile picture</b>
          </p>    

          <p className="text-sm my-2">
            Setup your profile by customizing your picture
          </p>
          <button
            onClick={() => setProfileModal(true)}
            className="w-full flex-shrink-0 rounded-md border bg-primary p-2 text-white"
          >
            Go
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default setting
