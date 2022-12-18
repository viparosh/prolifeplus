import React from 'react'
import { Patient } from '../../../components'
import Layout from '../../../components/Layout'

const patient = () => {
  return (
    <Layout title="Patients" role="Secretary">
      <Patient role="secretary" />
    </Layout>
  )
}

export default patient
