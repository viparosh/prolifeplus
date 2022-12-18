export const changePassword = async (id ,newData) => {
  const response = await fetch(`/api/users/changepassword/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}

export const resetPassword = async (newData) => {
  const response = await fetch(`/api/users/resetpassword/`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}

export const changeProfile = async (id ,newData) => {
  const response = await fetch(`/api/users/changeprofile/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}

export const login = async (newData) => {
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}

export const addUser = async (newData) => {
  const response = await fetch(`/api/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  return await response.json()
}

export const getWorkerUsers = async () => {
  const res = await fetch('/api/users/workers', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = await res.json()
  return result
}

export const getUser = async () => {
  const res = await fetch('/api/auth/checkAuth', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = await res.json()
  return result
}

export const authLogout = async () => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = await res.json()
  return result
}
