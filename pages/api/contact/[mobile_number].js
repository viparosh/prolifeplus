import dbConnect from '../../../utils/dbConnect'
import Contact from '../../../models/Contact'
dbConnect()

export default async (req, res) => {
  const {
    query: { mobile_number },
    method,
  } = req
  switch (method) {
    case 'GET':
      try {
        const contact = await Contact.find({ mobile_number: mobile_number })
        if (!contact) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: contact })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'PUT':
      try {
        const contact = await Contact.findOneAndUpdate(
          { mobile_number: mobile_number },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        )
        if (!contact) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: contact })
      } catch (error) {
        return res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
