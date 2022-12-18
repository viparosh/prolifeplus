import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { findPatientById } from '../../../services/patient.services'
import { ViewPatient, ModalForm } from '../../../components'
import Layout from '../../../components/Layout'
import { viewAllSession } from '../../../services/session.services'

const record = () => {
  const mode = ['new', 'edit']
  const [modalMode, setModalMode] = useState('')
  const router = useRouter()
  const { id } = router.query
  const [sessionData, setSessionData] = useState([])

  const mounted = useRef()

  const [patient, setPatient] = useState([])

  useEffect(() => {
    const load = async () => {
      const { success, data } = await findPatientById(id)

      if (success) {
        setPatient(data)
        const view = await viewAllSession(data?._id)
        if (view.success) setSessionData(view.data)
      }
    }

    if (!mounted.current) {
      load()
    }

    if (id) mounted.current = true
  })

  return (
    <Layout title="Patients" role="Admin">
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

export default record
