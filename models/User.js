const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required:true,
  },
  patientID:{
    type: String,
  },
  profileLink:{
    type: String,
  },
  password: {
    type: String,
    required:true
  },
  name: {
    type: String,
    required:true
  },
  role: {
    type: String,
    required:true
  },
})

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
