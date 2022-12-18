import React, { useRef } from 'react'
import { fieldSelect, fieldText } from '../../components/Patient/Fields'
import { SessionButtons } from '../../components/'
import { updateSession } from '../../services/session.services'

const PostPartum = ({
  setEditMode,
  sessionIndex,
  mode,
  sessionId,
  sessionData,
  setSessionData,
}) => {
  const ebfHomeVisitRef = useRef()
  const ebfClinicVisitRef = useRef()

  const familyPlanningHomeVisitRef = useRef()
  const familyPlanningClinicVisitRef = useRef()

  const feverHomeVisitRef = useRef()
  const feverClinicVisitRef = useRef()

  const vaginalBleedingHomeVisitRef = useRef()
  const vaginalBleedingClinicVisitRef = useRef()

  const excessiveBleedingHomeVisitRef = useRef()
  const excessiveBleedingClinicVisitRef = useRef()

  const polioHomeVisitRef = useRef()
  const polioClinicVisitRef = useRef()

  const cordOkHomeVisitRef = useRef()
  const cordOkClinicVisitRef = useRef()

  const saveHandler = async () => {
    const newData = {
      ebfHomeVisit: ebfHomeVisitRef.current.value,
      ebfClinicVisit: ebfClinicVisitRef.current.value,
      familyPlanningHomeVisit: familyPlanningHomeVisitRef.current.value,
      familyPlanningClinicVisit: familyPlanningClinicVisitRef.current.value,
      feverHomeVisit: feverHomeVisitRef.current.value,
      feverClinicVisit: feverClinicVisitRef.current.value,
      vaginalBleedingHomeVisit: vaginalBleedingHomeVisitRef.current.value,
      vaginalBleedingClinicVisit: vaginalBleedingClinicVisitRef.current.value,
      excessiveBleedingHomeVisit: excessiveBleedingHomeVisitRef.current.value,
      excessiveBleedingClinicVisit:
        excessiveBleedingClinicVisitRef.current.value,
      polioHomeVisit: polioHomeVisitRef.current.value,
      polioClinicVisit: polioClinicVisitRef.current.value,
      cordOkHomeVisit: cordOkHomeVisitRef.current.value,
      cordOkClinicVisit: cordOkClinicVisitRef.current.value,
    }

    let temp = sessionData
    let updateFunc = await updateSession(sessionId, newData)
    if (updateFunc.success) {
      console.log('ref', sessionData)
      const temp_session = {
        ...sessionData[sessionIndex],
        ...newData,
      }
      temp[sessionIndex] = temp_session
      console.log('new', temp)
      setSessionData(temp)
      setEditMode(false)
    }
  }
  return (
    <div className="flex h-sessionModal flex-col justify-between pb-20">
      <div className="px-8">
        <table className="w-full">
          <thead>
            <tr className="p-7">
              <th className="text-left">Actions</th>
              <th>Home Visit</th>
              <th>Clinic Visit</th>
            </tr>
          </thead>

          <tbody>
            <tr className="p-7">
              <td>Exclusive Breast Feeding</td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  ebfHomeVisitRef,
                  sessionData[sessionIndex]?.ebfHomeVisit,
                  'text',
                  !mode
                )}
              </td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  ebfClinicVisitRef,
                  sessionData[sessionIndex]?.ebfClinicVisit,
                  'text',
                  !mode
                )}
              </td>
            </tr>
            <tr className="p-7">
              <td>Intends to use family planning</td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  familyPlanningHomeVisitRef,
                  sessionData[sessionIndex]?.familyPlanningHomeVisit,
                  'text',
                  !mode
                )}
              </td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  familyPlanningClinicVisitRef,
                  sessionData[sessionIndex]?.familyPlanningClinicVisit,
                  'text',
                  !mode
                )}
              </td>
            </tr>
            <tr>
              <td>Fever (39 C)</td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  feverHomeVisitRef,
                  sessionData[sessionIndex]?.feverHomeVisit,
                  'text',
                  !mode
                )}
              </td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  feverClinicVisitRef,
                  sessionData[sessionIndex]?.feverClinicVisit,
                  'text',
                  !mode
                )}
              </td>
            </tr>
            <tr>
              <td>Foul smelling vaginal bleeding</td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  vaginalBleedingHomeVisitRef,
                  sessionData[sessionIndex]?.vaginalBleedingHomeVisit,
                  'text',
                  !mode
                )}
              </td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  vaginalBleedingClinicVisitRef,
                  sessionData[sessionIndex]?.vaginalBleedingClinicVisit,
                  'text',
                  !mode
                )}
              </td>
            </tr>
            <tr>
              <td>Excessive bleeding</td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  excessiveBleedingHomeVisitRef,
                  sessionData[sessionIndex]?.excessiveBleedingHomeVisit,
                  'text',
                  !mode
                )}
              </td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  excessiveBleedingClinicVisitRef,
                  sessionData[sessionIndex]?.excessiveBleedingClinicVisit,
                  'text',
                  !mode
                )}
              </td>
            </tr>
            <tr>
              <td>Polio</td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  polioHomeVisitRef,
                  sessionData[sessionIndex]?.polioHomeVisit,
                  'text',
                  !mode
                )}
              </td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  polioClinicVisitRef,
                  sessionData[sessionIndex]?.polioClinicVisit,
                  'text',
                  !mode
                )}
              </td>
            </tr>
            <tr>
              <td>Cord ok</td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  cordOkHomeVisitRef,
                  sessionData[sessionIndex]?.cordOkHomeVisit,
                  'text',
                  !mode
                )}
              </td>
              <td>
                {fieldText(
                  null,
                  null,
                  null,
                  cordOkClinicVisitRef,
                  sessionData[sessionIndex]?.cordOkClinicVisit,
                  'text',
                  !mode
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <SessionButtons
        save={saveHandler}
        editMode={mode}
        setEditMode={setEditMode}
      />
    </div>
  )
}

export default PostPartum
