import dbConnect from '../../../utils/dbConnect'
import WorkerSchedule from '../../../models/WorkerSchedule'
import moment from 'moment'

dbConnect()

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req

  switch (method) {
    case 'PUT':
      try {
        const userData = await WorkerSchedule.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })

        if (!userData) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: userData })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })

      break
  }
}
