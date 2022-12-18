import React from 'react'
import { Patient } from '../../../components'
import Layout from '../../../components/Layout'

const patient = () => {
  return (
    <Layout title="Patients" role="Midwife">
      <Patient role="midwife" />
    </Layout>
  )
}

export default patient
