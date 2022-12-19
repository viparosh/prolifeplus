import dbConnect from '../../../utils/dbConnect'
import Patient from '../../../models/Patient'
dbConnect()

export default async (req, res) => {
  const {
    query: { user },
    method,
  } = req

  switch (method) {

    case 'GET':
      try {
        Patient.aggregate([
          {
            $project: {
              name: { $concat: ['$fname', ' ', '$lname'] },
              profileLink:1,
              fname: 1,
              lname: 1,
              contact: 1,
              address: 1,
              birthDate: 1,
              birthPlace: 1,
              religion: 1,
              nationality: 1,
              occupation: 1,
              spouse_fname: 1,
              spouse_lname: 1,
              spouse_birthDate: 1,
              spouse_occupation: 1,
              spouse_religion: 1,
              no_previousPregnancies: 1,
              previousCaesareans: 1,
              consecutiveMiscarriages: 1,
              postpartumHemorrhage: 1,
              emergencyFname: 1,
              emergencyLname: 1,
              emergencyContact: 1,
              emergencyAddress: 1,
              sessionHistory: 1,
              estimatedDateOfDelivery: 1,
            },
          },
          {
            $match: {
              $or: [{ name: { $regex: user , $options : 'i'} }, { contact: user }],
            },
          },
        ]).exec(function (err, result) {
          if (err) {
            return res.status(400).json({ success: false, message: err })
          }
          res.status(200).json({ success: true, data: result })
        })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT':
      try {
        
        const patient = await Patient.findByIdAndUpdate(user, req.body, {
          new: true,
          runValidators: true,
        })

        if (!patient) {
          return res.status(400).json({ success: false })
        }

        res.status(200).json({ success: true, data: patient })
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
            estimatedDateOfDeliveryErr: err?.estimatedDateOfDelivery?.message
          },
        })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
