import React, { useState , useEffect } from 'react'
import { ChangePassword } from '../../components'
import Layout from '../../components/Layout'
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
      <div className="grid grid-cols-2 gap-4 mb-6">
      	<ChangePassword authUser={authUser} role="Patient" />
      </div>
    </Layout>
  )
}

export default settings
