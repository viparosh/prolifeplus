import dbConnect from '../../../utils/dbConnect'
import Schedule from '../../../models/Schedule'
import moment from 'moment'

dbConnect()

export default async (req, res) => {
  const { method } = req

  const month_year = moment().format('MMMM-YYYY')
  switch (method) {
    case 'GET':
      try {
        const schedules = await Schedule.find({ monthYear: month_year }).sort(
          '-date'
        )
        res.status(200).json({
          success: true,
          data: {
            monthYear: month_year,
            schedules: schedules,
          },
        })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'POST':
      try {
        const schedules = await Schedule.create(req.body)
        res.status(201).json({ success: true, data: schedules })
      } catch (error) {
        const err = error.errors
        console.log(err)
        res.status(400).json({
          success: false,
          // errors: error.errors,
          error: {
            firstNameError: err.firstName?.message,
            lastNameError: err.lastName?.message,
            addressError: err.address?.message,
            contactError:
              err.contact?.properties.type != 'minlength'
                ? err.contact?.message
                : 'Invalid Phone number',
            concernError: err.concern?.message,
            dateError: err.date?.message,
            timeError: err.time?.message,
            verification_codeError: err.verification_code?.message,
          },
          message: err.contact?.properties.type,
        })
      }
      break
    default:
      res.status(400).json({ success: false, message: 'sup' })
      break
  }
}
