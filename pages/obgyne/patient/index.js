import React from 'react'
import { Patient } from '../../../components'
import Layout from '../../../components/Layout'

const patient = ({}) => {
  return (
    <Layout title="Patients" role="Obgyne">
      <Patient role="obgyne" />
    </Layout>
  )
}

export default patient
