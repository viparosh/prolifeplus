export const getServerCancelSchedule = async (newData) => {
  const res = await fetch(`/api/servercancelappointment`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })

  return await res.json()
}

export const serverCancelSchedule = async (newData) => {
const res = await fetch(`/api/servercancelappointment`, {
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newData),
})

return await res.json()
}

export const getCancelSchedule = async (newData) => {
    const res = await fetch(`/api/cancelappointment`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })

    return await res.json()
}

export const cancelSchedule = async (newData) => {
  const res = await fetch(`/api/cancelappointment`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })

  return await res.json()
}

export const sendSmsCancelNote = async (newData) => {
  const res = await fetch(`/api/cancellationSms`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
}
