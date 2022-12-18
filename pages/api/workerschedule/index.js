import dbConnect from '../../../utils/dbConnect'
import WorkerSchedule from '../../../models/WorkerSchedule'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const userData = await WorkerSchedule.find({ status: 'requested' })
        
        res.status(200).json({
          success: true,
          data: userData,
        })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'POST':
      try {
        const userData = await WorkerSchedule.create(req.body)
        res.status(201).json({ success: true, data: userData })
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error,
        })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
