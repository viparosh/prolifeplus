import React, { useState, useRef, useEffect } from 'react'
import { findPatient } from '../../services/patient.services'
import Image from 'next/image'
import Link from 'next/link'

const Search = ({ setSearchMode, setFetchData, role }) => {
  const [search, setSearch] = useState('')
  const [patient, setPatient] = useState([])

  useEffect(() => {
    const load = async () => {
      setPatient(await findPatient(search))
    }
    if (search.length > 0) {
      load()
    }
  }, [search])
  return (
    <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
      <div className="mx-4 max-h-patientModal min-h-searchModal  overflow-auto rounded-md bg-white xl:min-w-searchModal">
        <div className="sticky left-0 top-0 z-40 bg-white py-6 px-4">
          <div className="flex gap-4">
            <div className="w-full">
              <input
                placeholder="Search Patient by name or contact #"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                className=" w-full rounded-md border border-inputBorder px-4 py-3"
              />
            </div>
            <button
              onClick={() => {
                setSearchMode(false)
              }}
              className="mx-2 ml-0 flex-shrink-0 rounded-md border bg-primary px-4 py-1 text-white"
            >
              Close
            </button>
          </div>
        </div>
        {search.trim().length > 0 && (
          <div className="px-4">
            <p className="mb-4 text-lg text-secondaryText">
              Search result for "{search}"
            </p>
            <div className="mt-4">
              {patient &&
                patient.map((data, index) => (
                  <Link href={`/${role}/patient/${data._id}`} key={index}>
                    <div
                      className="mb-4 flex cursor-pointer flex-col items-start gap-4 rounded-lg border border-inputBorder p-6 xl:flex-row"
                      key={index}
                    >
                      <img
                        src={(data.profileLink == '') ? 
                        "https://firebasestorage.googleapis.com/v0/b/mtathos-a572c.appspot.com/o/utilityImages%2Fdeuteronomy646d7423-f86f-49b6-aeb2-bb48f7f64001%20631ea34ffa819db75cd17503?alt=media&token=9114e5bc-2dc9-40ca-8062-4d9252cff0ec" 
                        : data?.profileLink}
                        className="rounded-md object-cover"
                        height="90px"
                        width="90px"
                      />

                      <div className="">
                        <p className="text-lg capitalize">
                          Name: {data.fname}&nbsp;
                          {data.lname}
                        </p>
                        <p className="text-lg">
                          Contact No#: (+63) {data.contact}
                        </p>
                        <p className="text-lg">Address: {data.address}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
