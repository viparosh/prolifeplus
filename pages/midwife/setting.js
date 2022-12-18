import React, { useEffect , useState, useRef } from 'react'
import { ChangePassword , ChangeProfile } from '../../components'
import Layout from '../../components/Layout'
import { getUser } from '../../services/user.services'

const settings = () => {
  
  const [profile,setProfile] = useState(false)
  const [authUser, setAuthUser] = useState()
  const [profileModal,setProfileModal] = useState(false)

  useEffect(async() => {
    const user = await getUser()
    
    if(user.success){
      setAuthUser(user.data)
    }

  },[])

  const updateProfile = (url) => {
    setProfile(url)
  }

  return (
   <Layout profile={profile} title="Account Settings" role="Midwife">
      {profileModal ? <ChangeProfile role="Worker" updateProfile={updateProfile} closeModal={setProfileModal} authUser={authUser} /> : <></>}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ChangePassword authUser={authUser} role="Secretary" />
        <div className="border-secondary rounded-md border px-4 py-4">
          <p>
            <b>Change profile picture</b>
          </p>    

          <p className="text-sm mt-5 mb-3">
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

export default settings
