import moment from 'moment'
const newDate = moment()

export const startDays = (date) => {
  return (moment(date).day() + 1).toString()
}
export const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const currentDay = newDate.format('D')

export const dateZeroFormat = (day) => {
  return day <= 9 ? `0` + day : day
}

// days generator
export const daysRange = (days) => {
  const start = 1
  const end = days
  const range = [...Array(end - start + 1).keys()].map((x) => x + start)
  return range
}

export const renderDate = (item, currentMonth) => {
  return `${currentMonth.year}-${dateZeroFormat(
    currentMonth.number
  )}-${dateZeroFormat(item)}`
}

export const month = {
  numberOfDays: daysRange(newDate.daysInMonth()),
  name: newDate.format('MMMM'),
  number: newDate.format('M'),
  year: newDate.format('YYYY'),
  active: true,
}

export const nextMonth = {
  numberOfDays: daysRange(newDate.add(1, 'M').daysInMonth()),
  name: newDate.format('MMMM'),
  number: newDate.format('M'),
  year: newDate.format('YYYY'),
  active: false,
}

export const dateScheduleFilter = async (dates) => {
  const finalDates = dates.join('|')

  const response = await fetch(`/api/calendar/${finalDates}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  let temp_array = []
  const { data } = await response.json()
  for (let x in dates.sort()) {
    let temp_data = null
    for (let y in data) {
      if (
        moment(dates[x]).format('YYYY-MM-DD') ==
        moment(data[y].date).format('YYYY-MM-DD')
      ) {
        temp_data = data[y]
      }
    }
    temp_data
      ? temp_array.push({
          date: dates[x],
          data: temp_data,
        })
      : temp_array.push({
          date: dates[x],
          data: null,
        })
  }

  return temp_array
}

export const timeScheduleFilter = async (time) => {
  var errorMessage = 'default'
  var flag = false

  for (let z = 0; z < time.length; z++) {
    for (let q in time) {
      if (time[q][0] > time[q][1] || time[q][0] == time[q][1]) {
        errorMessage = 'Time overlaps with another schedule'
        flag = true
        break
      }

      if (q != z) {
        if (time[q][0] < time[z][1] && time[q][1] >= time[z][1]) {
          if (
            moment(time[q][0]).format('YYYY-MM-DD') ==
            moment(time[z][0]).format('YYYY-MM-DD')
          ) {
            errorMessage =
              'Time overlaps with another schedule'
            flag = true
            break
          }
        }

        //SAME INDEX, SAME ELEMENT (REVERSE)
        if (time[z][1] == time[q][0] && time[z][0] == time[q][1]) {
          errorMessage = 'Time overlaps with another schedule'
          flag = true
          break
        }

        //SAME INDEX , SAME ELEMENT
        if (time[z][1] == time[q][1] || time[z][0] == time[q][0]) {
          flag = true
          errorMessage = 'Time overlaps with another schedule'
          break
        }
      }
    }

    if (flag) {
      time.pop()
      break
    }
  }

  if (flag) {
    return { success: false, message: errorMessage, data: time }
  }

  return {
    success: true,
    message: 'Added Succesfully!',
    data: time,
  }
}

export const timeScheduleFilterRequest = async (role,time,fieldDate) => {

  var errorMessage = 'default'
  var flag = false

  const response = await fetch(`/api/calendar/${fieldDate}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const res = await response.json()
  
  var t1 = moment(time[0]).format("YYYY-MM-DD HH:mm")
  var t2 =  moment(time[1]).format("YYYY-MM-DD HH:mm")

  if(t1 > t2 || t1 == t2){
    flag = true
    time.pop()
    errorMessage = 'Invalid time'
    return { success: false, message: errorMessage, data: time }
  }else{
    if(res.data.length != 0){
      var schedz =  res.data[0].obgyn_schedule
      if(role == "midwife")  schedz = res.data[0].midWife_schedule

      
      for(let h = 0; h < schedz.length; h++){

        var d1 = moment(schedz[h].from).format("YYYY-MM-DD HH:mm")
        var d2 = moment(schedz[h].to).format("YYYY-MM-DD HH:mm")
        
        if(t1 == d1 && t2 == d2){
          flag = true
          errorMessage = 'Schedule is already occupied'
          break;  
        }

        if((t1 < d2 && t2 >= d2) || (t1 < d1 && t2 > d1) || (t1 >= d1 && t2 <= d2)){
          flag = true
          errorMessage = 'Time overlaps with another schedule'
          break;    
        }
      }

      if (flag) {
        time.pop()
        return { success: false, message: errorMessage, data: time }
      }
    }
  }

  return {
    success: true,
    message: 'Added Succesfully!',
    data: time,
  }
}

export const sortSchedule = (tmp, date) => {
  var newSet = []

  var len = tmp.length

  var newSet = []

  for (let z = 0; z < len; z++) {
    var min = 0

    for (let x = 1; x < tmp.length; x++) {
      if (tmp[min][0] > tmp[x][0]) {
        min = x
      }
    }

    newSet.push(tmp[min])
    tmp.splice(min, 1)
  }
  let temp = []
  for (let i of newSet) {
    let from = moment(date + ' ' + i[0]).format('YYYY-MM-DD HH:mm')
    let to = moment(date + ' ' + i[1]).format('YYYY-MM-DD HH:mm')
    let status = i[2]
    let name = i[3]
    let username = i[4]
    let schedID = i[5]
    temp.push({ from, to, status, name, username, schedID })
  }
  return temp
}

export const updateCalendarSchedule = async (item, newData) => {
  if (item.data) {
    const response = await fetch(`/api/calendar/${item.date}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
    const { success } = await response.json()
    if (success) {
      return true
    }
  } else {
    newData.date = item.date
    const response = await fetch(`/api/calendar`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
    const { success } = await response.json()
    if (success) {
      return true
    }
  }
  return false
}
