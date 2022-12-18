import dbConnect from '../../../utils/dbConnect'
import Session from '../../../models/Session'
import moment from 'moment'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const sessionData = await Session.find()
        res.status(200).json({
          success: true,
          data: sessionData,
        })
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
      }
      break

    case 'POST':
      try {
        const sessionData = await Session.create(req.body)
        console.log(req.body)
        res.status(201).json({ success: true, data: sessionData })
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
