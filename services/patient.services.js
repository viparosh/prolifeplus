export const sendSmsVisitNote = async (newData) => {
  const res = await fetch(`/api/notify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
}

export const addNewPatient = async (newData) => {
  const response = await fetch(`/api/patient/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}

export const updatePatientAccount = async (newData) => {
  const response = await fetch(`/api/users`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })

  return await response.json()
}

export const updatePatient = async (id, newData) => {
  const response = await fetch(`/api/patient/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}

export const findPatient = async (user) => {
  const response = await fetch(`/api/patient/${user}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const { data } = await response.json()
  return data
}

export const findPatientById = async (id) => {
  const response = await fetch(`/api/patient/id/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  return data
}
