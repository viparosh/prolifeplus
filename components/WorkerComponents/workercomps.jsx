import React, { useState, useRef, useEffect } from 'react'
import Modal from '../../components/CustomModal/Modal'
import { uploadLog } from '../../services/log.services'
import Layout from '../../components/Layout'
import { submitRequest, workerStatus } from '../../services/worker.services'
import moment from 'moment'
import { getUser } from '../../services/user.services'
import { fieldText } from '../../components/Patient/Fields'
import { timeScheduleFilterRequest } from '../../services/calendar.services'
import WorkerRequestedTable from '../../components/WorkerRequestedTable'

const MyWorkerSchedule = ({workerRole}) => {

  const [authUser,setAuthUser] = useState()
  const [pageNumber, setPageNumber] = useState(0)
  const [dataPage, setDataPage] = useState([])
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState()
  const [modal, setModal] = useState(false)
  const date = moment().format('YYYY-MM-DD')
  const [fieldDate, setFieldDate] = useState(date)
  const fromRef = useRef()
  const toRef = useRef()
  const [successNotif, setSuccessNotif] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState()
  const statusRef = useRef()
  const [status, setStatus] = useState()
  
  const fetchSched = async (newData) => {
    const result = await workerStatus(newData)
    return result
  }

  const statusHandler = async (value) => {
    setPageNumber(0)
    var subUserID = user?._id

    //initialization

    if (!mounted) {
      const res = await getUser()
      if (res.success) {
        subUserID = res.data._id
      }
    }

    setStatus(value)
    const newData = {
      user_FK: subUserID,
      status: value,
    }
    let result = await fetchSched(newData)

    if (result.success) {
      var arr = [[]]
      var cnt = 0

      for (let i = 0; i < result.data.length; i++) {
        if (i % 7 == 0 && i != 0) {
          arr[cnt + 1] = [result.data[i]]
          cnt++
        } else {
          arr[cnt].push(result.data[i])
        }
      }

      setDataPage(arr)
      setData(arr[0])
    }
  }

  useEffect(async () => {
    const res = await getUser()

    if (res.success) {
      setAuthUser(res.data)
      setMounted(true)
      setUser(res.data)
      statusHandler('accepted')
    }
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()

    const newData = {
      date: fieldDate,
      to: moment(fieldDate + ' ' + toRef.current?.value).format(
        'YYYY-MM-DD HH:mm'
      ),
      from: moment(fieldDate + ' ' + fromRef.current?.value).format(
        'YYYY-MM-DD HH:mm'
      ),
      user_FK: user?._id,
      role: user?.role,
      status: 'requested',
      name: user?.name,
      username: user?.username,
    }

    let realTimeData = await fetchSched({
      user_FK: user._id,
      status: 'accepted',
    })

    const acceptedData = realTimeData?.data?.map(({ from, to }) => [
      moment(from).format('YYYY-MM-DD HH:mm'),
      moment(to).format('YYYY-MM-DD HH:mm'),
    ])

    const result = await timeScheduleFilterRequest(
      authUser.role,
      [newData.from, newData.to],
      moment(fieldDate).format("YYYY-MM-DD")
    )


    if (newData.date < date) {
      setError({ success: false, message: 'Please enter valid date' })
    } else {
      if (result.success) {
        
        const res = await submitRequest(newData)

        if (res.success) {
          setError(null)
          setSuccessNotif(true)
          await uploadLog(
            { 
              username_FK: authUser.username,
              content: `${authUser.name} (@${authUser.username}) requested a schedule on 
                ${moment(newData.date).format("MMMM DD, YYYY")}
                ( ${moment(newData.from).format("h:mm a")} - 
                ${moment(newData.to).format("h:mm a")} )`,
              category:"Request Worker Schedule",
              role:authUser.role,
              date:moment(Date.now()).format("MMMM DD, YYYY"),
              time:moment(Date.now()).format("h:mm a")
            }
          )

          if (status == 'requested') {
            setData([...data, res.data])
          }
          setModal(!modal)
          setSuccessNotif(false)
        }
      } else {
        setError(result)
      }
    }
  }

  const header = ['Date', 'From', 'To', 'Reason']

  return (
    <Layout title="My Schedule" role={workerRole}>
      <div>
        <div className="flex items-center justify-between">
          <select
            ref={statusRef}
            onChange={(e) => {
              statusHandler(e.target.value)
            }}
            className="mt-2 block rounded-md border border-inputBorder px-3 py-2"
          >
            <option value="accepted">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="requested">Requested</option>
          </select>
          <button
            className="rounded-md bg-primary p-2 px-6 text-slate-100"
            onClick={() => setModal(!modal)}
          >
            Create Request
          </button>
        </div>
        <WorkerRequestedTable
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          setDataPage={setDataPage}
          dataPage={dataPage}
          data={data}
          setData={setData}
          status={statusRef.current?.value}
          update={false}
          header={status != 'rejected' ? header.splice(0, 3) : header}
        />
      </div>
      {modal && (
        <Modal
          text="Create Request"
          setModal={setModal}
          handler={submitHandler}
        >
          {error && (
            <p
              className={`my-4 rounded-md ${
                !error?.success ? 'bg-red-500 ' : 'bg-emerald-500'
              }  px-4 py-2 text-white`}
            >
              {error?.message}
            </p>
          )}

           {successNotif && (
            <p
              className={`my-4 rounded-md bg-emerald-500 px-4 py-2 text-white`}
            >
              Schedule has been requested
            </p>
          )}

          <form onSubmit={submitHandler}>
            <div className="mt-4 w-full">
              <label htmlFor="date" className="block text-secondaryText">
                Date:
              </label>
              <input
                onChange={(e) => setFieldDate(e.target.value)}
                type="date"
                id="date"
                value={fieldDate}
                min={date}
                className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
              />
            </div>
            {fieldText(null, 'From:', 'from', fromRef, null, 'time')}
            {fieldText(null, 'To:', 'to', toRef, null, 'time')}
            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setModal(!modal)
                }}
                className=" mx-2 ml-0 rounded-md border p-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={submitHandler}
                className=" mx-2 ml-0 rounded-md border bg-primary p-2 px-4 text-slate-100"
              >
                Done
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  )
}

export default MyWorkerSchedule
