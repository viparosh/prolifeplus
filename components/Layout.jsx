import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Head from 'next/head'
import CreatePriority from './CustomModal/CreatePriority'
import { BellSvg, MenuSvg } from './Svg'
import { getUser } from '../services/user.services'

const Layout = ({ children, title, role, profile }) => {
  const [sidebarModal, setSidebarModal] = useState(false)
  const [priorityModal, setPriorityModal] = useState(false)
  const [userID, setUserID] = useState()

  useEffect(async () => {
    const res = await getUser()
    if (res.success) setUserID(res.data)
  }, [])

  return (
    <>
      <div className="flex">
        <Head>
          <title>Prolife + </title>
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap"
          />
        </Head>
        <Sidebar
          profile={profile}
          role={role}
          active={title}
          modal={sidebarModal}
          setModal={setSidebarModal}
        />
        <div className="w-full px-5 md:px-10">
          {priorityModal ? (
            <CreatePriority setPriorityModal={setPriorityModal} />
          ) : (
            <></>
          )}

          <div className="sticky top-0 z-10  flex items-center justify-between bg-white py-5 md:py-10 md:pb-5">
            <div className="flex">
              <span
                className="cursor-pointer md:hidden"
                onClick={() => setSidebarModal(!sidebarModal)}
              >
                <MenuSvg />
              </span>
              <h3 className="px-4 text-xl font-semibold text-secondaryText">
                {title}
              </h3>
            </div>
            <div className="relative">
              {role == 'Secretary' && title == 'Calendar Manager' ? (
                <button
                  className="rounded-md bg-primary px-4 py-2 text-sm text-white"
                  onClick={() => setPriorityModal(!priorityModal)}
                >
                  Create Priority Schedule
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="px-0 md:px-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout
