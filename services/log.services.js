export const uploadLog = async (newData) => {
    const res = await fetch(`/api/logs`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    })
}

export const getLog = async (newData) => {
    const response = await fetch(`/api/logs/category`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    })

    return await response.json()
}
