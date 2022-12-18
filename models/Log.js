const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
  username_FK: {
    type: String,
  },
  content: {
    type: String,
  },
  category: {
    type: String,
  },
  role:{
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  }
})

module.exports =
  mongoose.models.Log || mongoose.model('Log', LogSchema)
