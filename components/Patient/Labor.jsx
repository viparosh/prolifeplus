import React, { useRef } from 'react'
import { fieldSelect, fieldText } from '../../components/Patient/Fields'
import { SessionButtons } from '../../components/'
import { updateSession } from '../../services/session.services'
import moment from 'moment'

const Labor = ({
  setEditMode,
  sessionIndex,
  mode,
  sessionId,
  sessionData,
  setSessionData,
}) => {
  const ibfRef = useRef()
  const typeOfDeliveryRef = useRef()
  const dateOfDeliveryRef = useRef()
  const placeOfDeliveryRef = useRef()
  const birthWeightRef = useRef()
  const postpartumHemorrhageRef = useRef()
  const babyAliveRef = useRef()
  const babyHealthyRef = useRef()
  const saveHandler = async () => {
    const newData = {
      ibf: ibfRef.current.value,
      typeOfDelivery: typeOfDeliveryRef.current.value,
      dateOfDelivery: dateOfDeliveryRef.current.value,
      placeOfDelivery: placeOfDeliveryRef.current.value,
      birthWeight: birthWeightRef.current.value,
      postpartumHemorrhage: postpartumHemorrhageRef.current.value,
      babyAlive: babyAliveRef.current.value,
      babyHealthy: babyHealthyRef.current.value,
    }
    //copy
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
          {fieldText(
            null,
            'Immediate breast feeding:',
            'ibf',
            ibfRef,
            sessionData[sessionIndex]?.ibf,
            'text',
            !mode
          )}
          {fieldText(
            null,
            'Type of delivery:',
            'typeOfDelivery',
            typeOfDeliveryRef,
            sessionData[sessionIndex]?.typeOfDelivery,
            'text',
            !mode
          )}
          {fieldText(
            null,
            'Date of delivery:',
            'dateOfDelivery',
            dateOfDeliveryRef,
            sessionData[sessionIndex]?.dateOfDelivery
              ? moment(sessionData[sessionIndex]?.dateOfDelivery).format(
                  'YYYY-MM-DD'
                )
              : 'YYYY-MM-DD',

            'date',
            !mode
          )}
          {fieldText(
            null,
            'Place of delivery::',
            'placeOfDelivery',
            placeOfDeliveryRef,
            sessionData[sessionIndex]?.placeOfDelivery,
            'text',
            !mode
          )}
          {fieldText(
            null,
            'Birth weight in grams:',
            'birthWeight',
            birthWeightRef,
            sessionData[sessionIndex]?.birthWeight,
            'text',
            !mode
          )}
          {fieldText(
            null,
            'Postpartum hemmorrhage 5000cc:',
            'postpartumHemorrhage',
            postpartumHemorrhageRef,
            sessionData[sessionIndex]?.postpartumHemorrhage,
            'text',
            !mode
          )}
          {fieldSelect(
            null,
            'Baby alive:',
            'babyAlive',
            babyAliveRef,
            [
              { name: 'Yes', value: 'yes' },
              { name: 'No', value: 'no' },
            ],
            sessionData[sessionIndex]?.babyAlive,
            !mode
          )}
          {fieldSelect(
            null,
            'Baby healthy:',
            'babyHealthy',
            babyHealthyRef,
            [
              { name: 'Yes', value: 'yes' },
              { name: 'No', value: 'no' },
            ],
            sessionData[sessionIndex]?.babyHealthy,
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

export default Labor
