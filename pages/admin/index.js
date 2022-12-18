import React, { useEffect, useState , useRef} from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import StaffCompositionModal from '../../components/CustomModal/StaffCompositionModal'
import LogModal from '../../components/CustomModal/LogModal'
import { 
  getCount , 
  getDailyCancelCount,
  getWeeklyCancelCount,
  getMonthlyCancelCount,
  getDailyAppointmentCount, 
  getWeeklyAppointmentCount,
  getMonthlyAppointmentCount } from '../../services/statistics.services'

function dashboard() {

  const [dailyCancelledAppointment,setDailyCancelledAppointment] = useState()
  const [weeklyCancelledAppointment,setWeeklyCancelledAppointment] = useState()
  const [monthlyCancelledAppointment,setMonthlyCancelledAppointment] = useState()
  
  const [midwifeData,setMidWifeData] = useState()
  const [obgyneData,setObgyneData] = useState()
  const [secretaryData,setSecretaryData] = useState()
  const [patientData,setPatientData] = useState()
  const [category,setCategory] = useState()
  const [modal,setModal] = useState()

  const [roleStaff,setRoleStaff] = useState()
  const [categoryStaff,setCategoryStaff] = useState()
  const [modalStaff,setModalStaff] = useState()

  const [monthlyAppointment,setMonthlyAppointment] = useState()
  const [weeklyAppointment,setWeeklyAppointment] = useState()
  const [dailyAppointment,setDailyAppointment] = useState()

  const changeCategoryStaff = (role,data) => {
    setRoleStaff(role)
    setCategoryStaff(data)
    setModalStaff(true)
  }

  const changeCategory = (data) => {
    setCategory(data)
    setModal(true)
  }

  useEffect(() => {
    const load = async () => {
      const a = await getCount({role:"midwife"})
      if(a.success){
        setMidWifeData(a.data)
      }

      const b = await getCount({role:"obgyne"})
      if(b.success){
        setObgyneData(b.data)
      }

      const c = await getCount({role:"secretary"})
      if(c.success){
        setSecretaryData(c.data)
      }

      const d = await getCount({role:"patient"})
      if(d.success){
        setPatientData(d.data)
      }

      const e = await getDailyCancelCount()
      if(e.success){
        setDailyCancelledAppointment(e.data)
      }

      const f = await getMonthlyAppointmentCount()
      if(f.success){
        setMonthlyAppointment(f.data)
      }

      const g = await getWeeklyAppointmentCount()
      if(g.success){
        setWeeklyAppointment(g.data)
      }

      const h = await getDailyAppointmentCount()
      if(h.success){
        setDailyAppointment(h.data)
      }

      const i = await getWeeklyCancelCount()
      if(i.success){
        setWeeklyCancelledAppointment(i.data)
      }

      const j = await getMonthlyCancelCount()
      if(j.success){
        setMonthlyCancelledAppointment(j.data)
      }
    }
    load();

  },[])

  return (
    <Layout title="Dashboard" role="Admin">
      <div className="w-full flex flex-col lg:flex-row gap-10">
        {modalStaff ? <StaffCompositionModal roleStaff={roleStaff} category={categoryStaff} closeModal={setModalStaff} /> : <></>}
        {modal ? <LogModal category={category} closeModal={setModal} /> : <></>}
        <div className="w-full h-full grid grid-cols-2 gap-2">
          <div className="w-full p-4 rounded-md bg-orange-100">
            <p className="text-sm text-slate-800 font-semibold">
              Total Patients
            </p>
            <div className="mt-8 text-slate-800 w-full flex justify-end text-3xl">
              {patientData ? patientData?.length : 0}
            </div>
          </div>
          <div className="w-full p-4 rounded-md bg-orange-100">
            <p className="text-sm text-slate-800 font-semibold">
              Total Staffs
            </p>
            
            <div className="mt-8 text-slate-800 w-full flex justify-end text-3xl">
              { obgyneData ?  (secretaryData?.length+midwifeData?.length+obgyneData?.length)||0 :  0 } 
            </div>

          </div>
          <div className="w-full pb-6 p-4 rounded-md bg-orange-100">
            <p className="text-sm text-slate-800 font-semibold">
              Cancelled Appointments
            </p>
            <div className="mt-9 flex justify-around">
              <div className="w-1/4 flex  bg-orange-400 rounded-md p-3 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                  { monthlyCancelledAppointment ?  monthlyCancelledAppointment?.length :  0 } 
                </div>
                <p className="text-white text-sm">Monthly</p>
              </div>
              <div className="w-1/4 rounded-md flex bg-orange-700 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                  { weeklyCancelledAppointment ?  weeklyCancelledAppointment?.length :  0 } 
                </div>
                <p className="text-sm text-white">Weekly</p>
              </div>
              <div className="w-1/4 rounded-md flex bg-orange-800 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                { dailyCancelledAppointment ?  dailyCancelledAppointment?.length :  0 } 
                </div>
                <p className="text-sm text-white">Daily</p>
              </div>
            </div>  
          </div>
          <div className="w-full pb-6 p-4 rounded-md bg-orange-100">
            <p className="text-sm text-slate-800 font-semibold">
              Staff Composition
            </p>
            <div className="mt-9 flex justify-around">
              <button onClick={() => changeCategoryStaff("Secretary",secretaryData)} className="w-1/4 flex  bg-orange-400 rounded-md py-3 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                  { secretaryData ?  secretaryData?.length :  0 } 
                </div>
                <p className="text-white text-sm">Secretary</p>
              </button>
              <button onClick={() => changeCategoryStaff("OB-Gyne",obgyneData)} className="w-1/4 rounded-md flex bg-orange-700 py-3 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                  { obgyneData ?  obgyneData?.length :  0 } 
                </div>
                <p className="text-white text-sm">OB-Gyne</p>
              </button>
              <button onClick={() => changeCategoryStaff("Midwife",midwifeData)} className="w-1/4 rounded-md flex bg-orange-800 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                  { midwifeData ?  midwifeData?.length :  0 } 
                </div>
                <p className="text-white text-sm">Midwife</p>
              </button>
            </div>

          </div>
          <div className="w-full pb-6 p-4 rounded-md bg-orange-100">
            <p className="text-sm text-slate-800 font-semibold">
              Appointments
            </p>
            <div className="mt-9 flex justify-around">
              <div className="w-1/4 flex  bg-orange-400 rounded-md p-3 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                  { monthlyAppointment ?  monthlyAppointment?.length :  0 } 
                </div>
                <p className="text-white text-sm">Monthly</p>
              </div>
              <div className="w-1/4 rounded-md flex bg-orange-700 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                  { weeklyAppointment ?  weeklyAppointment?.length :  0 } 
                </div>
                <p className="text-sm text-white">Weekly</p>
              </div>
              <div className="w-1/4 rounded-md flex bg-orange-800 justify-center items-center flex-col">
                <div className="text-white flex justify-end text-2xl">
                  { dailyAppointment ?  dailyAppointment?.length :  0 } 
                </div>
                <p className="text-sm text-white">Daily</p>
              </div>
            </div>
          </div>
          <div className="w-full p-4 rounded-md bg-orange-100">
            <p className="text-sm text-slate-800 font-semibold">
              Staff - Cancel Appointment
            </p>
            <p className="my-4 text-sm">
              Cancel the upcoming appointment with your patient
            </p>
            <Link href="../cancellation/server">
              <button className="bg-orange-800 text-sm font-medium rounded-md px-4 py-2 text-white">Continue</button>
            </Link>
          </div>
          
        </div>
        <div className="overflow-y-auto w-[30rem] h-full lg:h-[42rem] gap-2 flex flex-col">
          <p className="sticky top-0 bg-white font-semibold text-gray-700 mb-3">System Logs</p>
          <button 
            onClick={() => changeCategory("Staff - Login")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Staff - Login
          </button>

          <button 
            onClick={() => changeCategory("Staff - Logout")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Staff - Logout
          </button>
          
          <button 
            onClick={() => changeCategory("Staff - Change Password")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Staff - Change Password
          </button>

          <button onClick={() => changeCategory("Staff - Change Profile")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Staff - Change Profile Picture
          </button>

          <button 
            onClick={() => changeCategory("Add Prenatal Record")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Add Prenatal Record
          </button>

          <button 
            onClick={() => changeCategory("Patient - Change Profile")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Patient - Change Profile Picture
          </button>

          <button 
            onClick={() => changeCategory("SMS Next Visit")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            SMS Next Visit
          </button>

          <button 
            onClick={() => changeCategory("Add/Update Patient")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Add / Update Patient
          </button>

          <button 
            onClick={() => changeCategory("Request Worker Schedule")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Request Worker Schedule
          </button>

          <button 
            onClick={() => changeCategory("Reset Password")} 
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Reset Password
          </button>

          <button 
            onClick={() => changeCategory("Add Staff Account")}
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Add Staff Account
          </button>

          <button 
            onClick={() => changeCategory("Cancelled Appointment")}
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Cancelled Appointments
          </button>

          <button 
            onClick={() => changeCategory("Patient - Login")}
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Patient - Login
          </button>

          <button 
            onClick={() => changeCategory("Patient - Logout")}
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Patient - Logout
          </button>

          <button 
            onClick={() => changeCategory("Patient - Change Password")}
            className="text-sm rounded bg-gray-700 py-2 text-white">
            Patient - Change Password
          </button>

        </div>
      
      </div>
    </Layout>
  )
}

export default dashboard
