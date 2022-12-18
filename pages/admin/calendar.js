import React from 'react'
import { RealCalendar } from '../../components'
import Layout from '../../components/Layout'

const Calendar = () => {
  return (
    <Layout title="Calendar Manager" role="Admin">
      <RealCalendar />
    </Layout>
  )
}

export default Calendar
