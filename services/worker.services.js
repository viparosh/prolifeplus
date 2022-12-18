export const workerStatus = async (newData) => {
  const response = await fetch(`/api/workerschedule/status`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}
export const getAllRequested = async () => {
  const response = await fetch(`/api/workerschedule`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return await response.json()
}

export const updateStatus = async (newData, id) => {
  const response = await fetch(`/api/workerschedule/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}

export const submitRequest = async (newData) => {
  const response = await fetch(`/api/workerschedule`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}
