import dbConnect from '../../../../utils/dbConnect'
import Schedule from '../../../../models/Schedule'
import moment from 'moment'

dbConnect()

export default async (req, res) => {
  const month_year = moment().format('MMMM-YYYY')

  const {
    query: { username },
    method,
  } = req

  switch (method) {
    case 'GET':
      try {
        const schedules = await Schedule.find({
          monthYear: month_year,
          'time.username': username,
        })
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
    default:
      res.status(400).json({ success: false })
      break
  }
}
