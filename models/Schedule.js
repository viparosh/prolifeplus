const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please input the required fields'],
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: [true, 'Please input the required fields'],
      maxlength: 30,
    },
    contact: {
      type: String,
      required: [true, 'Please input the required fields'],
      lowercase: true,
      minlength: 10,
      maxlength: 10,
    },
    consultation: {
      type: String,
    },
    address: {
      type: String,
      required: [true, 'Please input the required fields'],
      maxlength: 200,
    },
    concern: {
      type: String,
      required: [true, 'Please input the required fields'],
      maxlength: 200,
    },
    time: {
      type: {
        from: { type: Date },
        to: { type: Date },
        username: { type: String },
        status: { type: Boolean },
        schedID: { type: String},
      },
      required: [true, 'Please input the required fields'],
    },
    date: {
      type: Date,
      required: [true, 'Please input the required fields'],
    },
    monthYear: {
      type: String,
    },
    status: {
      type: String,
      default: 'pending',
    },
    cancellationCode: { 
      type: String
    },
    serverCancellationCode: { 
      type: String
    }
  },
  {
    timestamps: true,
  }
)

module.exports =
  mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema)
