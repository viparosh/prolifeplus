const mongoose = require('mongoose')

const CalendarSchema = new mongoose.Schema({
  date: {
    type: Date,
    unique: true,
  },
  midWife_schedule: [
    {
      from: { type: Date },
      to: { type: Date },
      status: { type: Boolean },
      name: {type: String},
      username: { type: String },
      schedID: { type: String },
    },
  ],
  obgyn_schedule: [
    {
      from: { type: Date },
      to: { type: Date },
      name: {type: String},
      status: { type: Boolean },
      username: { type: String },
      schedID: { type: String },
    },
  ],
})

module.exports =
  mongoose.models.Calendar || mongoose.model('Calendar', CalendarSchema)
