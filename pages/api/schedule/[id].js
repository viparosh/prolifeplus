import dbConnect from '../../../utils/dbConnect'
import Schedule from '../../../models/Schedule'
import moment from 'moment'
dbConnect()

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req
  switch (method) {
    case 'GET':
      try {
        const schedule = await Schedule.findById(id)
        console.log("run")
        for (let k = 0; k < schedule.length; k++) {
          if (
            moment(schedule.date).format('MM-DD-YYYY') >
            moment(Date.now()).format('MM-DD-YYYY')
          ) {
            schedule.splice(k, 1)
          }
        }

        if (!schedule) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: schedule })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'PUT':
      try {
        const schedule = await Schedule.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!schedule) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: schedule })
      } catch (error) {
        return res.status(400).json({ success: false })
      }
      break
    case 'DELETE':
      try {
        const deletedSchedule = await Schedule.deleteOne({ _id: id })

        if (!deletedSchedule) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
