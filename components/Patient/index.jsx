import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ModalForm, Search, ViewPatient } from '../../components'
import { SearchSvg } from '../../components/Svg'

const patient = ({ notSecretary, notMidWife, role }) => {
  const mode = ['new', 'edit']
  const [modalMode, setModalMode] = useState('')

  const [searchMode, setSearchMode] = useState(false)
  const [fetchData, setFetchData] = useState()

  return (
    <>
      {modalMode == 'add' && (
        <ModalForm mode={modalMode} closeModal={setModalMode} />
      )}
      <div>
        {searchMode && (
          <Search
            role={role}
            setSearchMode={setSearchMode}
            setFetchData={setFetchData}
          />
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setSearchMode(true)}
            className="  cursor-pointer rounded-md border border-inputBorder px-3 py-3"
          >
            <SearchSvg />
          </button>
          
          {(role == "secretary") && (
            <div
              className="flex items-center justify-center rounded-md border bg-orange-600 px-6 py-1 text-white"
            >
              <p>Cannot add patient due to role</p>
            </div>
          )}

          {(role != "secretary") && (
            <button
              onClick={() => {
                setModalMode('add')
              }}
              className="flex-shrink-0 rounded-md border bg-primary px-4 py-1 text-white"
            >
              New Patient
            </button>
          )}
        </div>
        
        <p className="my-5 text-center">
          Welcome to patient section. Use the search bar to find patient
        </p>
      </div>
    </>
  )
}

export default patient
