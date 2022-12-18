export const getCount = async (newData) => {
    const response = await fetch(`/api/stats/staffcount`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    })

    return await response.json()
}

export const getDailyCancelCount = async () => {
    const response = await fetch(`/api/stats/dailycancelcount`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })

    return await response.json()
}

export const getWeeklyCancelCount = async () => {
    const response = await fetch(`/api/stats/weeklycancelcount`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })

    return await response.json()
}


export const getMonthlyCancelCount = async () => {
    const response = await fetch(`/api/stats/monthlycancelcount`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })

    return await response.json()
}

export const getMonthlyAppointmentCount = async () => {
    const response = await fetch(`/api/stats/monthlyappointment`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })

    return await response.json()
}


export const getWeeklyAppointmentCount = async () => {
    const response = await fetch(`/api/stats/weeklyappointment`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })

    return await response.json()
}

export const getDailyAppointmentCount = async () => {
    const response = await fetch(`/api/stats/dailyappointment`, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })

    return await response.json()
}




