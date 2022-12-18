const mongoose = require('mongoose')

const WorkerScheduleSchema = new mongoose.Schema({
  user_FK: {
    type: String,
  },
  date: {
    type: Date,
  },
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
  },
  remarks: {
    type: String,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
  },
})

module.exports =
  mongoose.models.WorkerSchedule ||
  mongoose.model('WorkerSchedule', WorkerScheduleSchema)
