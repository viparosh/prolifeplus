import Link from 'next/link'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  DashboardSvg,
  AppointmentSvg,
  SettingSvg,
  PatientSvg,
  LogoutSvg,
  CloseSvg,
  CalendarSvg,
  RecordSvg,
  VisitSvg,
} from './Svg'
import { useRouter } from 'next/router'
import {uploadLog} from '../services/log.services'
import { authLogout, getUser } from '../services/user.services'

const Sidebar = ({ role, active, modal, setModal , profile }) => {

  const patientProfile = "https://firebasestorage.googleapis.com/v0/b/mtathos-a572c.appspot.com/o/utilityImages%2Fdeuteronomy646d7423-f86f-49b6-aeb2-bb48f7f64001%20631ea34ffa819db75cd17503?alt=media&token=9114e5bc-2dc9-40ca-8062-4d9252cff0ec"
  const [user, setUser] = useState()
  const router = useRouter()

  useEffect(async () => {
    const { data, success } = await getUser()
    if (success) {
      setUser({ username: data.username, name: data.name, role: data.role , profileLink: data.profileLink}) 
    }
  }, [])

  const logoutHandler = async () => {
    const result = await authLogout()
    if (result.success) {
      await uploadLog(
        { 
          username_FK: user.username,
          content: `${user.name} ${(user.role == "patient") ? "("+user.username+")" : "(@"+user.username+")"}  has logged out`,
          category:(user.role == "patient") ? "Patient - Logout" : "Staff - Logout",
          role:user.role,
          date:moment(Date.now()).format("MMMM DD, YYYY"),
          time:moment(Date.now()).format("h:mm a")
        }
      )
      router.push(role == 'Patient' ? '/login' : '/auth')
    }
  }

  const adminLinks = [
    {
      icon: <DashboardSvg />,
      name: 'Dashboard',
      link: '/admin',
    },
    {
      icon: <AppointmentSvg />,
      name: 'Appointment',
      link: '/admin/appointment',
    },
    {
      icon: <VisitSvg />,
      name: 'Suggested Visit',
      link: '/admin/nextvisit',
    },
    {
      icon: <PatientSvg />,
      name: 'Patients',
      link: '/admin/patient',
    },
    {
      icon: <SettingSvg />,
      name: 'Account Settings',
      link: '/admin/setting',
    },
    {
      icon: <CalendarSvg />,
      name: 'Calendar Manager',
      link: '/admin/calendar',
    },
  ]

  const obgyneLinks = [
    {
      icon: <AppointmentSvg />,
      name: 'Appointment',
      link: '/obgyne',
    },
    {
      icon: <PatientSvg />,
      name: 'Patients',
      link: '/obgyne/patient',
    },
    {
      icon: <CalendarSvg />,
      name: 'My Schedule',
      link: '/obgyne/myschedule',
    },
    {
      icon: <SettingSvg />,
      name: 'Account Settings',
      link: '/obgyne/setting',
    },
  ]

  const patientLinks = [
    {
      icon: <RecordSvg />,
      name: 'My Record',
      link: '/patient/record',
    },
    {
      icon: <SettingSvg />,
      name: 'Account Settings',
      link: '/patient/setting',
    },
  ]
  const midwifeLinks = [
    {
      icon: <AppointmentSvg />,
      name: 'Appointment',
      link: '/midwife',
    },
    {
      icon: <PatientSvg />,
      name: 'Patients',
      link: '/midwife/patient',
    },
    {
      icon: <CalendarSvg />,
      name: 'My Schedule',
      link: '/midwife/myschedule',
    },
    {
      icon: <SettingSvg />,
      name: 'Account Settings',
      link: '/midwife/setting',
    },
  ]
  const secretaryLinks = [
    {
      icon: <AppointmentSvg />,
      name: 'Appointment',
      link: '/secretary',
    },
    {
      icon: <VisitSvg />,
      name: 'Suggested Visit',
      link: '/secretary/nextvisit',
    },
    {
      icon: <PatientSvg />,
      name: 'Patients',
      link: '/secretary/patient',
    },
    {
      icon: <SettingSvg />,
      name: 'Account Settings',
      link: '/secretary/setting',
    },
    {
      icon: <CalendarSvg />,
      name: 'Calendar Manager',
      link: '/secretary/calendar',
    },
  ]

  const linkLayout = (link) => {
    return link.map(({ icon, name, link }, index) => (
      <li
        key={index}
        className="cursor-pointer text-secondaryText hover:text-primary"
      >
        <Link href={link}>
          <div
            className={`mb-2 flex items-center p-4 ${
              active == name && 'bg-primary'
            } rounded-lg`}
          >
            <span className="mr-2">{icon}</span>
            <p className=" text-slate-200">{name}</p>
          </div>
        </Link>
      </li>
    ))
  }
  
  return (
    <div
      className={`${
        modal ? 'translate-x-0' : '-translate-x-full'
      } fixed top-0 z-20 h-screen min-w-full bg-darkBlue px-14 md:sticky md:block md:min-w-sideBar md:translate-x-0`}
    >
      <div className="flex items-center justify-between py-10">
        <span className="text-center text-2xl font-black text-white">
          ProLife +
        </span>
        <span
          onClick={() => setModal(!modal)}
          className="cursor-pointer text-center text-2xl font-black text-white md:hidden"
        >
          <CloseSvg />
        </span>
      </div>
      <div className="mb-7 flex items-center">
        {
          (role == "Patient") ?         
          <img
            src={patientProfile}
            className="rounded-md"
            width="60px"
            height="60px"
          />
        :<img
            src={profile ? profile : user?.profileLink }
            className="rounded-md"
            width="60px"
            height="60px"
        />
        }
        
        <div className="ml-4 text-white">
          <p className="text-lg capitalize">{user?.name}</p>
          <span className="capitalize text-slate-400">{user?.role}</span>
        </div>
      </div>
      <div>
        <ul>
          {role == 'Admin'
            ? linkLayout(adminLinks)
            : role == 'Obgyne'
            ? linkLayout(obgyneLinks)
            : role == 'Midwife'
            ? linkLayout(midwifeLinks)
            : role == 'Patient'
            ? linkLayout(patientLinks)
            : linkLayout(secretaryLinks)}
          <li
            onClick={logoutHandler}
            className="mt-10 cursor-pointer text-secondaryText hover:text-primary"
          >
            <div>
              <div className={`mb-2 flex items-center rounded-lg p-4`}>
                <span className="mr-2">{<LogoutSvg />}</span>
                <p className=" text-slate-200">Logout</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
