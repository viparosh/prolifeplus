import dbConnect from '../../../utils/dbConnect'
import Session from '../../../models/Session'
dbConnect()

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req

  switch (method) {
    //   Get data according to selected dates
    case 'GET':
      try {
        Session.find({ user_ID: id }, function (err, result) {
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
        

        const updateSession = await Session.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })

        if (updateSession) {
          return res.status(200).json({ success: true, message: updateSession })
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
