export const uploadImage = async (newData) => {
  const res = await fetch(`/api/notify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
}