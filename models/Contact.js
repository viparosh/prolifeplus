const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
  mobile_number: {
    type: Number,
    unique: true,
  },
  verification_code: {
    type: Number,
    required: [true, 'Verification must have'],
  },
  expiration: {
    type: Date,
    required: [true, 'Expiration must have'],
  },
})

module.exports =
  mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
