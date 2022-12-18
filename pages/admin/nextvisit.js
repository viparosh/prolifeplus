import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { NextVisit } from '../../components'

const nextvisit = () => {
  return (
    <>
      <Layout title="Suggested Visit" role="Admin">
        <NextVisit/>
      </Layout>
    </>
  )
}

export default nextvisit
