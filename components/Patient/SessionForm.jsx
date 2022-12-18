import React, { useRef, useState } from 'react'
import { addSession, updatePatient } from '../../services/session.services'
import { General, Labor, Vaccine, PostPartum } from '../../components'

const SessionForm = ({
  userId,
  sessionIndex,
  setSessionModal,
  sessionModal,
  sessionId,
  sessionData,
  setSessionData,
  isPatient,
}) => {
  const [page, setPage] = useState('general')
  const [editMode, setEditMode] = useState(false)

  const listOfPages = [
    {
      name: 'General',
      pageState: 'general',
    },
    {
      name: 'Labor & Delivery',
      pageState: 'labor',
    },
    {
      name: 'Vaccine',
      pageState: 'vaccine',
    },
    {
      name: ' Post Partum',
      pageState: 'postpartum',
    },
  ]
  return (
    <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
      <div className="relative flex max-h-patientModal w-full max-w-sessionModal flex-col  justify-between overflow-auto rounded-md bg-white">
        <div>
          {/* header  */}
          <div className="sticky left-0 top-0 z-10 bg-white py-6 px-4">
            <div className="flex justify-between sm:flex-row flex-col">
              <p className="mb-4 px-4 text-xl">
                {editMode
                  ? `Update Prenatal Record #${sessionIndex + 1}`
                  : `View Prenatal Record #${sessionIndex + 1}`}
              </p>
              <div class="flex gap-4 justify-center items-left">
                {!isPatient && !editMode && (
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="cursor-pointer rounded-md bg-primary py-2  px-4 text-white"
                  >
                    Enable Edit Mode
                  </button>
                )}
                <button
                  onClick={() => setSessionModal(false)}
                  className="cursor-pointer rounded-md bg-slate-100 py-2  px-4"
                >
                  Close
                </button>
              </div>
            </div>
            <div className=" p-4">
              <ul className="m-0 flex flex-row gap-4 flex-wrap">
                {listOfPages.map(({ name, pageState }, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer rounded-md py-2  px-4 transition-colors ${
                      pageState == page
                        ? 'bg-primary text-white '
                        : 'bg-slate-200'
                    }`}
                    onClick={() => setPage(pageState)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* body  */}
          {page == 'general' ? (
            <General
              setEditMode={setEditMode}
              mode={editMode}
              userId={userId}
              sessionIndex={sessionIndex}
              sessionId={sessionId}
              sessionData={sessionData}
              setSessionData={setSessionData}
            />
          ) : page == 'labor' ? (
            <Labor
              setEditMode={setEditMode}
              mode={editMode}
              userId={userId}
              sessionIndex={sessionIndex}
              sessionId={sessionId}
              sessionData={sessionData}
              setSessionData={setSessionData}
            />
          ) : page == 'vaccine' ? (
            <Vaccine
              setEditMode={setEditMode}
              mode={editMode}
              userId={userId}
              sessionIndex={sessionIndex}
              sessionId={sessionId}
              sessionData={sessionData}
              setSessionData={setSessionData}
            />
          ) : (
            <PostPartum
              setEditMode={setEditMode}
              mode={editMode}
              userId={userId}
              sessionIndex={sessionIndex}
              sessionId={sessionId}
              sessionData={sessionData}
              setSessionData={setSessionData}
            />
          )}
        </div>
        {/* footer  */}
        {/* <div className="sticky bottom-0 right-0 flex items-center justify-end gap-2 bg-white p-4"></div> */}
      </div>
    </div>
  )
}
export default SessionForm
