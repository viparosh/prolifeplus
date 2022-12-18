import moment from 'moment'

const sessionPopulate = (userId, contact, name) => {
  const data = {
    user_ID: userId,
    contact: contact,
    name: name,
    month: [
      {
        monthNumber: 1,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
      {
        monthNumber: 2,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
      {
        monthNumber: 3,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
      {
        monthNumber: 4,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
      {
        monthNumber: 5,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
      {
        monthNumber: 6,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
      {
        monthNumber: 7,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
      {
        monthNumber: 8,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
      {
        monthNumber: 9,
        visit: [
          { visitNumber: 1 },
          { visitNumber: 2 },
          { visitNumber: 3 },
          { visitNumber: 4 },
          { visitNumber: 5 },
        ],
      },
    ],
  }
  return data
}

const filterNextVisit = (data) => {
    const suggestions = []

  var uid = []
  for (let q = 0; q < data.length; q++) {
    var w = 0
    for (; w < data.length; w++) {
      if (data[q].user_ID == data[w].user_ID) {
        break
      }
    }

    if (w == q) {
      uid.push(data[q].user_ID)
    }
  }

  for (var z = 0; z < uid.length; z++) {
    let latestData = {
      id: uid[z],
      date: '',
      pregnancyNo: '',
      month: '',
      visit: '',
    }

    var cnt = 0

    // sample count
    for (var t = 0; t < data.length; t++) {
      if (data[t].user_ID == uid[z]) cnt++
    }
    // end of sample count

    for (var y = data.length - 1; y >= 0; y--) {
      var empty = true
      if (data[y].user_ID == uid[z]) {
        for (let r = data[y].month.length - 1; r >= 0; r--) {
          for (let x = data[y].month[r].visit.length - 1; x >= 0; x--) {
            if (data[y].month[r].visit[x].nextVisit != null) {
              latestData.name = data[y].name
              latestData.contact = data[y].contact
              latestData.pregnancyNo = cnt
              latestData.date = data[y].month[r].visit[x].nextVisit
              latestData.month = data[y].month[r].monthNumber
              latestData.visit = data[y].month[r].visit[x].visitNumber

              const sd = moment(latestData.date).format('MM-DD-YYYY').split('-')
              const cd = moment(Date.now()).format('MM-DD-YYYY').split('-')

              suggestions.push(latestData)
              empty = false
              break
            }
          }
          if (empty == false) break
        }
        cnt--
        if (empty == false) break
      }
    }
  }

  suggestions.sort((a, b) => {
    let da = new Date(a.date),
        db = new Date(b.date);
    return db - da;
  })
  
  return suggestions
}


export const getNextVisit = async () => {
  const response = await fetch(`/api/session/nextvisit`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const { success, data } = await response.json()

  const suggestions = filterNextVisit(data)
  const subData = []

  for(let k = 0; k < suggestions.length; k++){
    const nd = moment(new Date()).format("MM-DD-YYYY")
    const cd = moment(new Date(suggestions[k].date)).format("MM-DD-YYYY")
      
    if(cd >= nd){
      subData.push(suggestions[k])
    }
  }  
  
  return { success, subData }
}

export const getUpcomingVisit = async (dayDiff) => {
  const response = await fetch(`/api/session/nextvisit`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const { success, data } = await response.json()

  const suggestions = filterNextVisit(data)
  const subData = []

  for(let k = 0; k < suggestions.length; k++){
    const nd = moment(new Date()).format("MM-DD-YYYY")
    const cd = moment(new Date(suggestions[k].date)).format("MM-DD-YYYY")
  
    if(cd >= nd){

      const ndx = nd.split("-")
      const cdx = cd.split("-")

      var day1 = new Date(nd);
      var day2 = new Date(cd);

      var difference = ((day2.getTime()-day1.getTime()) / 86400000);

      if(difference <= dayDiff){
        subData.push(suggestions[k])
      }
    }
  }  
  
  return { success, subData }
}

export const addSession = async (id, contact, name) => {
  const response = await fetch(`/api/session/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionPopulate(id, contact, name)),
  })
  const { success, data } = await response.json()
  return { success, data }
}

export const viewAllSession = async (user_id) => {
  const response = await fetch(`/api/session/${user_id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const { success, data } = await response.json()
  return { success, data }
}

export const updateSessionContact = async (newData) => {
  const response = await fetch(`/api/session/`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  const { success, data } = await response.json()
  return { success, data }
}

export const updateSession = async (session_id, newData) => {
  const response = await fetch(`/api/session/${session_id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
  const { success, data } = await response.json()
  return { success, data }
}

export const sessionFormat = (refData, newData) => {
  for (var x = 0; x < newData.length; x++) {
    for (let q = 0; q < refData.length; q++) {
      if (refData[q].monthNumber == newData[x].monthNumber) {
        for (let i = 0; i < newData[x].visit.length; i++) {
          var z = 0
          for (; z < refData[q].visit.length; z++) {
            if (
              refData[q].visit[z].visitNumber == newData[x].visit[i].visitNumber
            ) {
              refData[q].visit[z] = newData[x].visit[i]
              break
            }
          }

          if (z == refData[q].visit.length) {
            refData[q].visit.push(newData[x].visit[i])
          }
        }
      }
    }
  }

  return refData
}
