import React, { useEffect, useState } from 'react'
import { RealCalendar, RequestedTable } from '../../components'
import CreatePriority from '../../components/CustomModal/CreatePriority'
import Layout from '../../components/Layout'
import { getAllRequested } from '../../services/worker.services'

const calendar = () => {
  const [data, setData] = useState()
  const header = ['Date', 'From', 'To', 'Role', 'User', 'Action 1', 'Action 2']
  
  useEffect(async () => {
    const res = await getAllRequested()
    if (res.success) {
      setData(res.data)
    }
  }, [])

  return (
    <Layout title="Calendar Manager" role="Secretary">
      <RealCalendar />
      
      <p className="mt-4 p-4 text-lg font-semibold text-slate-800">
        Request List
      </p>

      {data && (
        <RequestedTable
          setData={setData}
          data={data}
          update={true}
          header={header}
        />
      )}
      
    </Layout>
  )
}

export default calendar
