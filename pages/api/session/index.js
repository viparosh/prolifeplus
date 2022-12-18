import dbConnect from '../../../utils/dbConnect'
import Session from '../../../models/Session'

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
        res.status(400).json({ success: false })
      }
      break

    case 'POST':
      try {
        const sessionData = await Session.create(req.body)
        res.status(201).json({ success: true, data: sessionData })
      } catch (error) {
        res.status(400).json({
          success: false,
          error:error
        })
      }
      break

      case 'PUT':
      try {
        

        const updateSession = await Session.updateMany({user_ID:req.body.id},  { name: req.body.name, contact: req.body.contact }  , {
          new: true,
          runValidators: true,
          multi: true
        })

        if (updateSession) {
          return res.status(200).json({ success: true, message: updateSession })
        } else {
          return res.status(400).json({ success: false , message: "haram"})
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
