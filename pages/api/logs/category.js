import dbConnect from '../../../utils/dbConnect'
import Log from '../../../models/Log'

dbConnect()

export default async (req, res) => {
  const { method } 
  = req

  switch (method) {
    case 'POST':
    try {
        const getLogs = await Log.find({category:req.body})
        res.status(200).json({
            success: true,
            data: getLogs,
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
