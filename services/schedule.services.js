import moment from 'moment'

export const getSchedule = async () => {
  const res = await fetch('/api/schedule', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const result = await res.json()
  return result
}

export const getMySchedule = async (username) => {
  const res = await fetch(`/api/schedule/role/${username}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const result = await res.json()
  return result
}

export const formatSchedule = (draft) => {
  const day = moment().format('D')
  var data = {}
  data.monthYear = draft.monthYear
  data.schedules = [] //make array schedule

  for (let x in draft.schedules) {
    var dt = draft.schedules[x].date.split('T')
    var fd = dt[0].split('-')[2]

    if (parseInt(fd) >= day) {
      if (x == 0) {
        data.schedules.push({
          day: parseInt(fd),
          schedule: [draft.schedules[x]],
        })
      } else {
        var flag = true
        for (var y = 0; y < data.schedules.length; y++) {
          if (fd == data.schedules[y].day) {
            data.schedules[y].schedule.push(draft.schedules[x])
            flag = false
            break
          }
        }

        if (flag) {
          data.schedules.push({
            day: parseInt(fd),
            schedule: [draft.schedules[x]],
          })
        }
      }
    }
  }

  //manual sorting of date
  var tmp = {}
  const len = data.schedules.length
  tmp.monthYear = data.monthYear
  tmp.schedules = [] //make array schedule

  for (let z = 0; z < len; z++) {
    var min = 0
    for (let c = 1; c < data.schedules.length; c++) {
      if (data.schedules[c].day < data.schedules[min].day) {
        min = c
      }
    }

    tmp.schedules.push(data.schedules[min])
    data.schedules.splice(min, 1)
  }

  var tmpLen = tmp.schedules
  var finalTmp = {}
  finalTmp.monthYear = data.monthYear
  finalTmp.schedules = []

  for (let y = 0; y < tmpLen.length; y++) {
    const finalLen = tmpLen[y].schedule.length
    var sub = []

    for (let q = 0; q < finalLen; q++) {
      var min = 0

      for (let t = 1; t < tmpLen[y].schedule.length; t++) {
        if (
          tmpLen[y].schedule[t].time.from < tmpLen[y].schedule[min].time.from
        ) {
          min = t
        }
      }

      sub.push(tmpLen[y].schedule[min])
      tmpLen[y].schedule.splice(min, 1)
    }

    finalTmp.schedules[y] = { day: tmpLen[y].day, schedule: sub }
  }

  data = finalTmp
  return data
}
