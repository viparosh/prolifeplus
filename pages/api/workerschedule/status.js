import dbConnect from '../../../utils/dbConnect'
import WorkerSchedule from '../../../models/WorkerSchedule'

dbConnect()

export default async (req, res) => {
  const { method } = req

  const { user_FK, status } = req.body
  switch (method) {
    case 'POST':
      try {
        //sort date
        const userData = await WorkerSchedule.find({
          $and: [{ user_FK: user_FK }, { status: status }],

        }).sort({date:-1})

        res.status(200).json({
          success: true,
          data: userData,
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
