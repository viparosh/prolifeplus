const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema({
  contact: {
    type: String,
    unique: true,
    required: [true, 'Field must not be empty'],
  },
  profileLink:{
    type:String,
  },
  fname: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  lname: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  address: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  birthDate: {
    type: Date,
    required: [true, 'Field must not be empty'],
  },
  birthPlace: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  religion: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  nationality: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  occupation: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  spouse_fname: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  spouse_lname: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  spouse_birthDate: {
    type: Date,
    required: [true, 'Field must not be empty'],
  },
  spouse_occupation: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  spouse_religion: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  no_previousPregnancies: {
    type: Number,
    required: [true, 'Field must not be empty'],
  },
  previousCaesareans: {
    type: Number,
    required: [true, 'Field must not be empty'],
  },
  consecutiveMiscarriages: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  postpartumHemorrhage: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  emergencyFname: { type: String, required: [true, 'Field must not be empty'] },
  emergencyLname: { type: String, required: [true, 'Field must not be empty'] },
  emergencyContact: {
    type: String,
    required: [true, 'Field must not be empty'],
  },
  importantNote:{
    type:String
  },
  emergencyAddress: {
    type: String,
    required: [true, 'Field must not be empty'],
  }
})

module.exports =
  mongoose.models.Patient || mongoose.model('Patient', PatientSchema)
