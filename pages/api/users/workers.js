import dbConnect from '../../../utils/dbConnect'
import Users from '../../../models/User'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const userData = await Users.find({$or:[
          {role:"midwife"},
          {role:"obgyne"}
        ]})
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