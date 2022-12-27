import React, { useRef, useState } from 'react'
import {
  fieldText,
  fieldSelect,
  fieldTextarea,
} from '../../components/Patient/Fields'
import { SessionButtons } from '../../components/'
import { sessionFormat, updateSession } from '../../services/session.services'
import moment from 'moment'
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'
import { v4 } from 'uuid'
import { storage } from './firebase'

const General = ({
  setEditMode,
  sessionIndex,
  mode,
  sessionId,
  sessionData,
  setSessionData,
}) => {

  const monthRef = useRef()
  const [selectedSession, setSelectedSession] = useState(
    sessionData[sessionIndex].month[0].visit[0]
  )
  const visitRef = useRef()
  const semesterRef = useRef()
  const dateRef = useRef()
  const aogInWeeksRef = useRef()
  const weightRef = useRef()
  const remarksRef = useRef()

  const crRef = useRef()
  const tempRef = useRef()
  const fhRef = useRef()
  const fhtRef = useRef()
  const bpRef = useRef()
  const presRef = useRef()

  const bloodTypeRef = useRef()
  const hgbRef = useRef()
  const urinalysisRef = useRef()
  const respiratoryRateRef = useRef()
  const vdrRef = useRef()

  const heartRateRef = useRef()
  const measurementRef = useRef()

  const ironFotateRxRef = useRef()
  const mibfRef = useRef()
  const adviseDangerSignsRef = useRef()

  const emergencyPlanRef = useRef()
  const nextVisitRef = useRef()

  const tuberculosisRef = useRef()
  const heartDiseaseRef = useRef()
  const diabetesRef = useRef()
  const bronchilRef = useRef()
  const goiterRef = useRef()
  const successRef = useRef()
  
  const inputRef = useRef()
  const [image, setImage] = useState(null)
  const [previewImg,setPreviewImg] = useState(null)

  const inputRef2 = useRef()
  const [image2, setImage2] = useState(null)
  const [previewImg2,setPreviewImg2] = useState(null)
  
  const inputRef3 = useRef()
  const [image3, setImage3] = useState(null)
  const [previewImg3,setPreviewImg3] = useState(null)

  const triggerFileSelectPopup = (tempInputRef) => {
    tempInputRef.current.click()
  }

  const onUpload = (newData,imgVar,index) => {
    if (imgVar) {
      const imageRef = ref(storage, `ultrasound/${'exodus' + v4()} extend`)
      uploadBytes(imageRef, imgVar).then((snapshot) => {

      getDownloadURL(snapshot.ref).then(async (url) => {
      
        if(index == 1){
          setImage(null)
          setPreviewImg(null)
          newData.visit[0].ultrasound1 = url
          setSelectedSession.ultrasound1 = url

        }else if(index == 2){
          setImage2(null)
          setPreviewImg2(null)

          newData.visit[0].ultrasound2 = url
          setSelectedSession.ultrasound2 = url
          
        }else{
          setImage3(null)
          setPreviewImg3(null)   
          newData.visit[0].ultrasound3 = url
          setSelectedSession.ultrasound3 = url
          
        }

        extendSaveHandler(newData)

        })
      })
    }
  }

  const extendSaveHandler = async (newData) => {
    const formattedData = sessionFormat(sessionData[sessionIndex].month, [
      newData,
    ])

    let updateFunc = await updateSession(sessionId, { month: formattedData })
    if (updateFunc.success) {
      let temp = sessionData
      const temp_session = {
        ...sessionData[sessionIndex],
        month: formattedData,
      }

      temp[sessionIndex] = temp_session
      setSessionData(temp)
      setSelectedSession(
        temp_session.month[monthRef.current.value - 1].visit[
          visitRef.current.value - 1
        ]
      )

      const ty =
        temp_session.month[monthRef.current.value - 1].visit[
          visitRef.current.value - 1
        ]

      setEditMode(false)
    }
  }

  const saveHandler = async () => {
    const newData = {
      monthNumber: monthRef.current.value,
      visit: [
        {
          visitNumber: visitRef.current.value,
          semester: semesterRef.current.value,
          date: dateRef.current.value,
          aogInWeeks: aogInWeeksRef.current.value,
          weight: weightRef.current.value,
          remarks: remarksRef.current.value,
          cr: crRef.current.value,
          temp: tempRef.current.value,
          fh: fhRef.current.value,
          fht: fhtRef.current.value,
          bp: bpRef.current.value,
          pres: presRef.current.value,
          bloodType: bloodTypeRef.current.value,
          hgb: hgbRef.current.value,
          urinalysis: urinalysisRef.current.value,
          respiratoryRate: respiratoryRateRef.current.value,
          vdr: vdrRef.current.value,
          heartRate: heartRateRef.current.value,
          measurement: measurementRef.current.value,
          ironFotateRx: ironFotateRxRef.current.value,
          mibf: mibfRef.current.value,
          adviseDangerSigns: adviseDangerSignsRef.current.value,
          nextVisit: nextVisitRef.current.value,
          tuberculosis: tuberculosisRef.current.value,
          heartDisease: heartDiseaseRef.current.value,
          diabetes: diabetesRef.current.value,
          bronchil: bronchilRef.current.value,
          goiter: goiterRef.current.value,
          emergencyPlan: emergencyPlanRef.current.value,            
          ultrasound1:selectedSession?.ultrasound1,
          ultrasound2: selectedSession?.ultrasound2,
          ultrasound3: selectedSession?.ultrasound3
        },
      ],
    }

    if(image != null || image2 != null || image3 != null){
      if(image != null) await onUpload(newData,image,1)
      if(image2 != null) await onUpload(newData,image2,2)
      if(image3 != null) await onUpload(newData,image3,3)
    }else{
      extendSaveHandler(newData)
    }
    
  }

  const testFunc = () => {

    setImage(null)
    setPreviewImg(null)
    setImage2(null)
    setPreviewImg2(null)
    setImage3(null)
    setPreviewImg3(null)

    let monthNo = monthRef.current.value
    let visitNo = visitRef.current.value

    const selected =
      sessionData[sessionIndex].month[monthNo - 1].visit[visitNo - 1]
    setSelectedSession({ ...selectedSession, ...selected })

  }

  const onSelectFile = (event,tmpSetImage,tmpSetPreviewImg) => {
    const reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.addEventListener('load', () => {
        tmpSetImage(event.target.files[0])
        tmpSetPreviewImg(reader.result)
    })
  }

  return (
    <div className="flex h-sessionModal flex-col justify-between pb-20">
      {successRef.current && (
        <p className="w-full rounded-md bg-emerald-300 p-4 text-emerald-700">
          Update Successfully!
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 px-8 sm:grid-cols-3">
        <div className="col-span-2">
          <div className="mb-2 flex gap-4 border-b-2 border-dashed border-slate-400  pb-4 ">
            {fieldSelect(
              null,
              'Month:',
              'month',
              monthRef,
              [
                { name: '1', value: '1' },
                { name: '2', value: '2' },
                { name: '3', value: '3' },
                { name: '4', value: '4' },
                { name: '5', value: '5' },
                { name: '6', value: '6' },
                { name: '7', value: '7' },
                { name: '8', value: '8' },
                { name: '9', value: '9' },
              ],
              null,
              mode,
              {
                event: true,
                func: testFunc,
              }
            )}
            {fieldSelect(
              null,
              'Visit:',
              'visit',
              visitRef,
              [
                { name: '1', value: '1' },
                { name: '2', value: '2' },
                { name: '3', value: '3' },
                { name: '4', value: '4' },
                { name: '5', value: '5' },
              ],
              null,
              mode,
              {
                event: true,
                func: testFunc,
              }
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 border-b-2 border-dashed border-slate-400 pb-4">
            <div>
              {fieldText(
                null,
                'Semester:',
                'semester',
                semesterRef,
                selectedSession?.semester,
                'number',
                !mode
              )}
              {fieldText(
                null,
                'Date:',
                'date',
                dateRef,
                selectedSession?.date
                  ? moment(selectedSession?.date).format('YYYY-MM-DD')
                  : 'YYYY-MM-DD',
                'date',
                !mode
              )}
              {fieldText(
                null,
                'AOG in weeks:',
                'aoginweeks',
                aogInWeeksRef,
                selectedSession?.aogInWeeks,
                'number',
                !mode
              )}
              {fieldText(
                null,
                'Weight (Kg):',
                'weight',
                weightRef,
                selectedSession?.weight,
                'number',
                !mode
              )}
              {fieldText(
                null,
                'Remarks:',
                'remarks',
                remarksRef,
                selectedSession?.remarks,
                'string',
                !mode
              )}
            </div>
            <div>
              {fieldText(
                null,
                'CR:',
                'cr',
                crRef,
                selectedSession?.cr,
                'text',
                !mode
              )}
              {fieldText(
                null,
                'Temp (Celsius):',
                'temp',
                tempRef,
                selectedSession?.temp,
                'number',
                !mode
              )}
              {fieldText(
                null,
                'FH (cm):',
                'fn',
                fhRef,
                selectedSession?.fh,
                'number',
                !mode
              )}
              {fieldText(
                null,
                'FHT:',
                'fht',
                fhtRef,
                selectedSession?.fht,
                'number',
                !mode
              )}
              {fieldText(
                null,
                'BP (mmHg):',
                'bp',
                bpRef,
                selectedSession?.bp,
                'string',
                !mode
              )}
              {fieldText(
                null,
                'PRES:',
                'pres',
                presRef,
                selectedSession?.pres,
                'string',
                !mode
              )}
            </div>
          </div>
          <div>
            <p className="py-4">Laboratory Result</p>
            <div className="grid grid-cols-2 gap-4 border-b-2 border-dashed border-slate-400 pb-4">
              <div>
                {fieldText(
                  null,
                  'Blood Type:',
                  'bloodtype',
                  bloodTypeRef,
                  selectedSession?.bloodType,
                  'text',
                  !mode
                )}
                {fieldText(
                  null,
                  'Hgb:',
                  'hgb',
                  hgbRef,
                  selectedSession?.hgb,
                  'text',
                  !mode
                )}
                {fieldText(
                  null,
                  'Urinalysis:',
                  'urinalysis',
                  urinalysisRef,
                  selectedSession?.urinalysis,
                  'text',
                  !mode
                )}
              </div>
              <div>
                {fieldText(
                  null,
                  'Respiratory Rate:',
                  'respiratoryRate',
                  respiratoryRateRef,
                  selectedSession?.respiratoryRate,
                  'text',
                  !mode
                )}
                {fieldText(
                  null,
                  'VDR:',
                  'vdr',
                  vdrRef,
                  selectedSession?.vdr,
                  'text',
                  !mode
                )}
              </div>
            </div>

            <p className="py-4">Baby Information</p>
            <div className="flex flex-col pb-4 border-b-2 border-dashed border-slate-400">
              <div className="flex gap-x-4">
                <button onClick={() => {if(mode) { triggerFileSelectPopup(inputRef)}}} className="w-1/2 flex justify-center items-center h-56 border rounded-md">
                  <input
                      onChange={() => onSelectFile(event,setImage,setPreviewImg)}
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                  />
                
                  {!mode ? (selectedSession?.ultrasound1 == "")  ? "No Image": <img className="w-full h-full" src={selectedSession?.ultrasound1}/> :
                   (image) ? 
                   <img className="w-full h-full" src={previewImg}/> : 
                   "Upload Image"}
                  
                  
                </button>
                <button onClick={() => {if(mode) { triggerFileSelectPopup(inputRef2)}}} className="w-1/2 flex justify-center items-center h-56 border rounded-md">
                  <input
                      onChange={() => onSelectFile(event,setImage2,setPreviewImg2)}
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      ref={inputRef2}
                  />
                 
                  {!mode ? (selectedSession?.ultrasound2 == "") ? "No Image": <img className="w-full h-full" src={selectedSession?.ultrasound2}/> :
                   (image2) ? 
                   <img className="w-full h-full" src={previewImg2}/> : 
                   "Upload Image"}
                
                </button>
                <button onClick={() => {if(mode) { triggerFileSelectPopup(inputRef3)}}} className="w-1/2 flex justify-center items-center h-56 border rounded-md">
                  <input
                      onChange={() => onSelectFile(event,setImage3,setPreviewImg3)}
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      ref={inputRef3}
                  />
                 
                 {!mode ? (selectedSession?.ultrasound3 == "") ? "No Image": <img className="w-full h-full" src={selectedSession?.ultrasound3}/> :
                   (image3) ? 
                   <img className="w-full h-full" src={previewImg3}/> : 
                   "Upload Image"}


                </button>
              </div>
              <div className="flex w-full gap-x-4">
              {fieldText(
                null,
                'Heart Rate:',
                'heartRate',
                heartRateRef,
                selectedSession?.heartRate,
                'text',
                !mode
              )}
              {fieldText(
                null,
                'Measurement (cm):',
                'measurement',
                measurementRef,
                selectedSession?.measurement,
                'number',
                !mode
              )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-4">
              {fieldText(
                null,
                'Iron/fotate/Rx:',
                'ironFotateRx',
                ironFotateRxRef,
                selectedSession?.ironFotateRx,
                'text',
                !mode
              )}
              {fieldSelect(
                null,
                'Mother intends to breast feed:',
                'mibf',
                mibfRef,
                [
                  { name: 'No', value: 'no' },
                  { name: 'Yes', value: 'yes' },
                ],
                selectedSession?.mibf,
                !mode
              )}
            </div>
            {fieldTextarea(
              null,
              'Advise on 4 danger signs:',
              'adviseDangerSigns',
              adviseDangerSignsRef,
              selectedSession?.adviseDangerSigns,
              !mode
            )}
          </div>
        </div>
        <div className="col-span-1">
          <div className="border-b-2 border-dashed border-slate-400 pb-4">
            {fieldText(
              null,
              'Suggested date to create an appointment:',
              'nextVisit',
              nextVisitRef,
              selectedSession?.nextVisit
                ? moment(selectedSession?.nextVisit).format('YYYY-MM-DD')
                : 'YYYY-MM-DD',
              'date',
              !mode
            )}
            {fieldTextarea(
              null,
              'Emergency plans and place of delivery:',
              'emergencyPlan',
              emergencyPlanRef,
              selectedSession?.emergencyPlan,
              !mode
            )}
            
          </div>
          <div>
            <p className="py-4">Present Health Problems</p>
            {fieldSelect(
              null,
              'Tuberculosis:',
              'tuberculosis',
              tuberculosisRef,
              [
                { name: 'No', value: 'no' },
                { name: 'Yes', value: 'yes' },
              ],
              selectedSession?.tuberculosis,
              !mode
            )}
            {fieldSelect(
              null,
              'Heart Disease:',
              'heartDisease',
              heartDiseaseRef,
              [
                { name: 'No', value: 'no' },
                { name: 'Yes', value: 'yes' },
              ],
              selectedSession?.heartDisease,
              !mode
            )}
            {fieldSelect(
              null,
              'Diabetes:',
              'diabetes',
              diabetesRef,
              [
                { name: 'No', value: 'no' },
                { name: 'Yes', value: 'yes' },
              ],
              selectedSession?.diabetes,
              !mode
            )}
            {fieldSelect(
              null,
              'Bronchil Asthma:',
              'bronchil',
              bronchilRef,
              [
                { name: 'No', value: 'no' },
                { name: 'Yes', value: 'yes' },
              ],
              selectedSession?.bronchil,
              !mode
            )}
            {fieldSelect(
              null,
              'Goiter:',
              'goiter',
              goiterRef,
              [
                { name: 'No', value: 'no' },
                { name: 'Yes', value: 'yes' },
              ],
              selectedSession?.goiter,
              !mode
            )}
          </div>
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

export default General
