import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../components/Layout'
import { ViewPatient, ModalForm } from '../../components'
import { findPatientById } from '../../services/patient.services'
import { viewAllSession } from '../../services/session.services'

import { useRouter } from 'next/router'
import { getUser } from '../../services/user.services'

const dashboard = () => {
  const [sessionData, setSessionData] = useState([])
  const router = useRouter()
  const { id } = router.query

  const mounted = useRef()
  const [modalMode, setModalMode] = useState('')

  const [patient, setPatient] = useState([])

  useEffect(() => {
    const load = async () => {
      const res = await getUser()
      // console.log(res.data.patientID)
      if (res.success) {
        const { success, data } = await findPatientById(res.data.patientID)
        if (success) {
          setPatient(data)
          const view = await viewAllSession(data?._id)
          if (view.success) setSessionData(view.data)
        }
        mounted.current = true
      }
    }

    if (!mounted.current) {
      load()
    }
  })

  return (
    <Layout title="My Record" role="Patient">
      {modalMode == 'update' && (
        <ModalForm
          mode={modalMode}
          closeModal={setModalMode}
          data={patient}
          setData={setPatient}
        />
      )}
      <div>
        {patient ? (
          <ViewPatient
            id={id}
            isPatient={true}
            closeModal={setModalMode}
            data={patient}
            sessionData={sessionData}
            setSessionData={setSessionData}
          />
        ) : (
          <></>
        )}
      </div>
    </Layout>
  )
}

export default dashboard
