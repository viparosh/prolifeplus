import dbConnect from '../../../utils/dbConnect'
import Calendar from '../../../models/Calendar'
dbConnect()

export default async (req, res) => {
  const {
    query: { dates },
    method,
  } = req
  const finalDates = dates.split('|')
  switch (method) {
    //   Get data according to selected dates
    case 'GET':
      try {
        Calendar.find({ date: { $in: finalDates } }, function (err, result) {
          if (err) {
            return res.status(400).json({ success: false })
          }
          res.status(200).json({ success: true, data: result })
        })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'PUT':
      try {
        let updateCalendar
        if (finalDates.length > 1) {
          updateCalendar = await Calendar.updateMany(
            { date: { $in: finalDates } },
            req.body,
            {
              new: true,
              runValidators: true,
            }
          )
        } else {
          updateCalendar = await Calendar.findOneAndUpdate(
            { date: finalDates },
            req.body,
            {
              new: true,
              runValidators: true,
            }
          )
        }
        if (updateCalendar) {
          return res
            .status(200)
            .json({ success: true, message: updateCalendar })
        } else {
          return res.status(400).json({ success: false })
        }
      } catch (error) {
        res.status(200).json({ success: false, message: error.message })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
