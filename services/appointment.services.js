import moment from 'moment'

export const checkExistingAppointment = async (newData) => {
  const res = await fetch('/api/contact/existingappointment', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  const result = await res.json()
  return result
}

const formatBySecond = (date) => {
  let data = new Date(date)
  return data.getTime() / 1000
}

const expirationGenerator = () => {
  return moment().add(10, 'seconds').format('YYYY-MM-DD HH:mm:ss')
}

const codeGenerator = () => {
  return Math.floor(Math.random() * 999999)
}

const updateExpiration = async (number) => {
  const newData = {
    verification_code: codeGenerator(),
    expiration: expirationGenerator(),
  }
  
  const res = await fetch(`/api/contact/${number}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  const { data } = await res.json()
  sendSms({
    mobile_number: number,
    verification_code: newData.verification_code,
  })
  const timestamp = formatBySecond(data.expiration)
  let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
  const diff = formatBySecond(currentDateTime) - timestamp
  return diff * -1 || false
}

const insertExpiration = async (number) => {
  const newData = {
    mobile_number: number,
    verification_code: codeGenerator(),
    expiration: expirationGenerator(),
  }
  const res = await fetch(`/api/contact`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  const { data } = await res.json()
  sendSms({
    mobile_number: number,
    verification_code: newData.verification_code,
  })
  
  const timestamp = formatBySecond(data.expiration)
  let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
  const diff = formatBySecond(currentDateTime) - timestamp
  return diff * -1 || false
}

export const idChecker = (arr, id) => {
  return arr.some(function (el) {
    return el._id === id && el.status === true
  })
}
export const addAppointment = async (newData) => {
  const res = await fetch('/api/schedule', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  const result = await res.json()
  return result
}

export const checkVerificationCode = async (number, code) => {
  const res = await fetch(`/api/contact/${number}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const { data } = await res.json()

  if (data.length) {
    if (data[0].verification_code == code) {
      return true
    }
  }
  return false
}

export const updateSchedule = async (date, newData) => {
  const res = await fetch(`/api/calendar/${date}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  const { success } = await res.json()
  if (success) {
    return true
  }
  return false
}

export const checkExpiration = async (number) => {
  const res = await fetch(`/api/contact/${number}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const { data } = await res.json()
  if (data.length) {
    const timestamp = formatBySecond(data[0].expiration)
    let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss')

    const diff = formatBySecond(currentDateTime) - timestamp
    if (diff >= 1) {
      // console.log(diff)
      return await updateExpiration(number)
    }
    return diff * -1
  } else {
    return await insertExpiration(number)
  }
}

const sendSms = async (newData) => {
  const res = await fetch(`/api/code/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
}

export const sendSmsNote = async (newData) => {
  const res = await fetch(`/api/confirmation`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
}
