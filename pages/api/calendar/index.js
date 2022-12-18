import dbConnect from '../../../utils/dbConnect'
import Calendar from '../../../models/Calendar'
import moment from 'moment'

dbConnect()

export default async (req, res) => {
  const { method } = req

  const month_year = moment().format('MMMM-YYYY')
  switch (method) {
    case 'GET':
      try {
        const schedules = await Calendar.find()
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
      console.log(typeof req.body.midwife_schedule)

      try {
        const calendar = await Calendar.create(req.body)
        res.status(201).json({ success: true, data: calendar })
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        })
      }
      break

    case 'DELETE':
      try {
        const deleteCalelendar = await Calendar.deleteMany({})
        res.status(201).json({ success: true })
      } catch (error) {
        res.status(201).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
