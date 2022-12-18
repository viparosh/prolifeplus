import React, { useState, useEffect, useRef} from 'react'
import moment from 'moment'
import {getUser} from '../../services/user.services'
import { EditSvg , ChangeProfileSvg } from '../Svg'
import SessionForm from './SessionForm'
import { findPatientById } from '../../services/patient.services'
import { addSession, viewAllSession } from '../../services/session.services'
import ChangeProfile from './ChangeProfile'
import NewPregnancy from './NewPregnancy'

const ViewPatient = ({
  id,
  data,
  closeModal,
  sessionData,
  setSessionData,
  isSecretary,
  isPatient,
}) => {

  const [authUser,setAuthUser] = useState()
  const [sessionModal, setSessionModal] = useState(false)
  const [sessionId, setSessionId] = useState()
  const sessionIndex = useRef()
  const [profileModal,setProfileModal] = useState(false)
  const [profile,setProfile] = useState(data.profileLink)
  const [isChanged,setIsChanged] = useState(false)
  const [catchPhraseModal,setCatchPhraseModal] = useState(false)

  useEffect(async() => {
    const user = await getUser()
   
    if(user.success){
      setAuthUser(user.data)
    }

  },[])

  const updateProfile = async() => {
    const user = await findPatientById(data?._id)

    if(user.success){
      data.profileLink = user.data.profileLink
      setIsChanged(true)
      setProfile(user.data.profileLink)
    } 
  }
 
  const addPregnancy = async () => {
    let name = data?.fname + ' ' + data?.lname
    let contact = data?.contact
    const res = await addSession(id, contact, name)
    if (res.data) setSessionData([...sessionData, res.data])
  }
  return (
    <>
      <div className="py-5">
        {sessionModal ? (
          <SessionForm
            isPatient={isPatient}
            userId={id}
            sessionIndex={sessionIndex.current}
            sessionId={sessionId}
            setSessionModal={setSessionModal}
            sessionModal={sessionModal}
            sessionData={sessionData}
            setSessionData={setSessionData}
          />
        ) : (
          <></>
        )}

        {profileModal ? (
            <ChangeProfile role="Patient" updateProfile={updateProfile} authUser={authUser} patientData={data} closeModal={setProfileModal}/>
          ):<></>
        }

        {catchPhraseModal ? (
         <NewPregnancy patientData={data} authUser={authUser} number={(Math.floor(Math.random() * 4000)+1000)+""} closeModal={setCatchPhraseModal} addPregnancy={addPregnancy}/> 
        ):<></>}

        <p className="text-dark py-4 text-xl font-semibold">
          View Patient Record
        </p>
        <div className="flex w-full flex-col gap-4 py-5 xl:flex-row xl:items-start">
          <div className="shrink-0">
            {
              (data.profileLink == '') ? 
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mtathos-a572c.appspot.com/o/utilityImages%2Fdeuteronomy646d7423-f86f-49b6-aeb2-bb48f7f64001%20631ea34ffa819db75cd17503?alt=media&token=9114e5bc-2dc9-40ca-8062-4d9252cff0ec"
                className="rounded-md object-cover"
                height="130px"
                width="130px"
              />
              :
              <img
                src={isChanged ? profile : data.profileLink}
                className="rounded-md object-cover"
                height="130px"
                width="130px"
              />
            }
            
          </div>
          <div className="flex w-full justify-between">
            <div className="leading-7">
              <div className="mb-2 xl:flex">
                <span className="font-semibold">Name:&nbsp;&nbsp;</span>
                <p className="font-medium capitalize">
                  {data?.fname} {data?.lname}
                </p>
              </div>
              <div className="mb-2 xl:flex">
                <span className="font-semibold">ID:&nbsp;&nbsp;</span>
                <p>{data?._id}</p>
              </div>
              <div className="mb-2 xl:flex">
                <span className="font-semibold">Contact No#:&nbsp;&nbsp;</span>
                <p>(+63) {data?.contact}</p>
              </div>
              <div className="mb-2 xl:flex">
                <span className="font-semibold">Address:&nbsp;&nbsp;</span>
                <p>{data?.address}</p>
              </div>
            </div>
            {!isPatient && data?.fname && (
              <p>
                <button
                  onClick={() => setProfileModal(true)}
                  className="mx-2 ml-0 flex-shrink-0 rounded-md border bg-slate-100 px-2 py-2 "
                >
                  <ChangeProfileSvg className="bg-black"/>
                </button>

                <button
                  onClick={() => closeModal('update')}
                  className="mx-2 ml-0 flex-shrink-0 rounded-md border bg-slate-100 px-2 py-2 "
                >
                  <EditSvg />
                </button>
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-10 xl:grid-cols-3">
          {/* first column  */}
          <div>
            <div className="mt-2 border-b-2 border-solid border-slate-370 pb-4">
              <p className="py-4 text-lg font-semibold text-darkBlue">
                Patient Information
              </p>
              <p className="my-2 ">
                <span className="text-cyan-900">Birth Date:&nbsp;&nbsp;</span>
                {data?.birthDate &&
                  moment(data?.birthDate).format('MMM DD ,YYYY')}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Birth Place:&nbsp;&nbsp;</span>
                {data?.birthPlace}
              </p>
              <p className="my-2 capitalize">
                <span className="text-cyan-900">Religion:&nbsp;&nbsp;</span>
                {data?.religion}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Nationality:&nbsp;&nbsp;</span>
                {data?.nationality}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Occupation:&nbsp;&nbsp;</span>
                {data?.occupation}
              </p>
            </div>
            <div className="mt-2 border-b-2 border-solid border-slate-370 pb-4">
              <p className="py-4 text-lg font-semibold text-darkBlue">
                Spouse Information
              </p>
              <p className="my-2 capitalize">
                <span className="text-cyan-900">Name:&nbsp;&nbsp;</span>
                <span> {data?.spouse_fname} {data?.spouse_lname}</span>
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Birth Date:&nbsp;&nbsp;</span>
                {data?.spouse_birthDate &&
                  moment(data?.spouse_birthDate).format('MMM DD ,YYYY')}
              </p>
              <p className="my-2 capitalize">
                <span className="text-cyan-900">Religion:&nbsp;&nbsp;</span>
                {data?.spouse_religion}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Age:&nbsp;&nbsp;</span>
                {data?.spouse_age}
              </p>
              <p className="my-2 capitalize">
                <span className="text-cyan-900">Occupation:&nbsp;&nbsp;</span>
                {data?.spouse_occupation}
              </p>
            </div>
          </div>
          {/* second column  */}
          <div>
            <div className="mt-2 border-b-2 border-solid border-slate-370 pb-4">
              <p className="py-4 text-lg font-semibold text-darkBlue">
                Obstetrical History
              </p>
              <p className="my-2">
                <span className="text-cyan-900">No. of previous pregnancies:&nbsp;&nbsp;</span>
                {data?.no_previousPregnancies}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Previous Caesarians:&nbsp;&nbsp;</span>
                {data?.previousCaesareans}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">3 Consecutive Miscarriages:&nbsp;&nbsp;</span>
                {data?.consecutiveMiscarriages}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Postpartum Hemorrhage:&nbsp;&nbsp;</span>
                {data?.postpartumHemorrhage}
              </p>
            </div>
            <div className="mt-2 border-b-2 border-solid border-slate-370 pb-4">
              <p className="py-4 text-lg font-semibold text-darkBlue">
                Emergency Details
              </p>
              <p className="my-2 capitalize">
                <span className="text-cyan-900">Name:&nbsp;&nbsp;</span>
                {data?.emergencyFname} {data?.emergencyLname}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Contact #:&nbsp;&nbsp;</span>
                {data?.emergencyContact}
              </p>
              <p className="my-2">
                <span className="text-cyan-900">Address:&nbsp;&nbsp;</span>
                {data?.emergencyAddress}
              </p>
            </div>
          </div>
          {/* third column  */}
          {!isSecretary && (
            <div>
              <div className="mt-2 border-b-2 border-solid border-slate-370 pb-4">
                <div className="flex flex-row justify-between">
                  <p className="py-4 text-lg font-semibold text-darkBlue">
                    Prenatal History
                  </p>
                  {!isPatient && (
                    <button
                      onClick={() => setCatchPhraseModal(true)}
                      className="mt-1 h-10 w-10 border"
                    >
                      +
                    </button>
                  )}
                </div>
                {sessionData &&
                  sessionData?.map((data, index) => (
                    <div
                      key={index}
                      className="flex flex-row items-center justify-between"
                    >
                      <p className="my-2">Prenatal # {index + 1}</p>
                      <button
                        onClick={() => {
                          setSessionModal('view')
                          sessionIndex.current = index
                          setSessionId(data._id)
                        }}
                        className="w-1/3 flex-shrink-0 rounded-md border bg-gray-800 p-2 text-white"
                      >
                        View
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ViewPatient
