import dbConnect from '../../../utils/dbConnect'
import Patient from '../../../models/Patient'
import moment from 'moment'

dbConnect()

export default async (req, res) => {
  const { method } = req

  const month_year = moment().format('MMMM-YYYY')
  switch (method) {
    case 'GET':
      try {
        const patient = await Patient.find()
        res.status(200).json({
          success: true,
          data: patient,
        })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'POST':
      try {
      
        const patient = await Patient.create(req.body)
        res.status(201).json({ success: true, data: patient })
      
      } catch (error) {
        let tmp_error = ''
        const err = error.errors
        
        if (error.code == 11000) {
          tmp_error = 'Contact is already registered'
        } else {
          tmp_error = err.contact?.message
        }
             
        res.status(400).json({
          success: false,
          error: {
            fnameErr: err?.fname?.message,
            lnameErr: err?.lname?.message,
            contactErr: tmp_error,
            addressErr: err?.address?.message,
            birthDateErr: err?.birthDate?.message,
            birthPlaceErr: err?.birthPlace?.message,
            religionErr: err?.religion?.message,
            nationalityErr: err?.nationality?.message,
            occupationErr: err?.occupation?.message,
            spouse_fnameErr: err?.spouse_fname?.message,
            spouse_lnameErr: err?.spouse_lname?.message,
            spouse_birthDateErr: err?.spouse_birthDate?.message,
            spouse_occupationErr: err?.spouse_occupation?.message,
            spouse_religionErr: err?.spouse_religion?.message,
            no_previousPregnanciesErr: err?.no_previousPregnancies?.message,
            previousCaesareansErr: err?.previousCaesareans?.message,
            consecutiveMiscarriagesErr: err?.consecutiveMiscarriages?.message,
            postpartumHemorrhageErr: err?.postpartumHemorrhage?.message,
            emergencyFnameErr: err?.emergencyFname?.message,
            emergencyLnameErr: err?.emergencyLname?.message,
            emergencyContactErr: err?.emergencyContact?.message,
            emergencyAddressErr: err?.emergencyAddress?.message,
          }
        })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
