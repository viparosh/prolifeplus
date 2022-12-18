import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Head from 'next/head'
import { BellSvg, MenuSvg } from './Svg'

const NoLayout = ({ children, title }) => {
  return (
    <div className="h-screen">
      <Head>
        <title>Prolife +</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap"
        />
      </Head>
      {children}
    </div>
  )
}

export default NoLayout
