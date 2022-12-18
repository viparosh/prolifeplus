import dbConnect from '../../../utils/dbConnect'
import Log from '../../../models/Log'

dbConnect()

export default async (req, res) => {
  const { method } 
  = req

  switch (method) {

    case 'POST':
      try {
        const postLogs = await Log.create(req.body)
        res.status(201).json({ success: true, data: postLogs })
      } catch (error) {
        res.status(201).json({ success: true, message: error })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
