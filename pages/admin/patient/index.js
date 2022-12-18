import React from 'react'
import { Patient } from '../../../components'
import Layout from '../../../components/Layout'

const patient = () => {
  return (
    <Layout title="Patients" role="Admin">
      <Patient role="admin" />
    </Layout>
  )
}

export default patient
