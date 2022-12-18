import React, { useRef } from 'react'
import { fieldSelect } from '../../components/Patient/Fields'
import { SessionButtons } from '../../components/'
import { updateSession } from '../../services/session.services'

const Vaccine = ({
  setEditMode,
  sessionIndex,
  mode,
  sessionId,
  sessionData,
  setSessionData,
}) => {
  const tt1Ref = useRef()
  const tt2Ref = useRef()
  const tt3Ref = useRef()
  const tt4Ref = useRef()
  const tt5Ref = useRef()

  const saveHandler = async () => {
    const newData = {
      tt1: tt1Ref.current.value,
      tt2: tt2Ref.current.value,
      tt3: tt3Ref.current.value,
      tt4: tt4Ref.current.value,
      tt5: tt5Ref.current.value,
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
    <div className="flex h-sessionModal flex-col justify-between pb-10">
      <div className="px-8">
        <div className="grid grid-cols-2 gap-4 pb-4">
          {fieldSelect(
            null,
            'TT1 @5mos of pregnancy:',
            'tt1',
            tt1Ref,
            [
              { name: 'No', value: 'no' },
              { name: 'Yes', value: 'yes' },
            ],
            sessionData[sessionIndex]?.tt1,
            !mode
          )}
          {fieldSelect(
            null,
            'TT2 After a month:',
            'tt2',
            tt2Ref,
            [
              { name: 'No', value: 'no' },
              { name: 'Yes', value: 'yes' },
            ],
            sessionData[sessionIndex]?.tt2,
            !mode
          )}
          {fieldSelect(
            null,
            'TT3 After 6 months:',
            'tt3',
            tt3Ref,
            [
              { name: 'No', value: 'no' },
              { name: 'Yes', value: 'yes' },
            ],
            sessionData[sessionIndex]?.tt3,
            !mode
          )}
          {fieldSelect(
            null,
            'TT4 After 1 year:',
            'tt4',
            tt4Ref,
            [
              { name: 'No', value: 'no' },
              { name: 'Yes', value: 'yes' },
            ],
            sessionData[sessionIndex]?.tt4,
            !mode
          )}
          {fieldSelect(
            null,
            'TT5 After 1 year:',
            'tt5',
            tt5Ref,
            [
              { name: 'No', value: 'no' },
              { name: 'Yes', value: 'yes' },
            ],
            sessionData[sessionIndex]?.tt5,
            !mode
          )}
        </div>
      </div>
      <SessionButtons
        save={saveHandler}
        editMode={mode}
        setEditMode={setEditMode}
      />
    </div>
  )
}

export default Vaccine
