import dbConnect from '../../../../utils/dbConnect'
import Patient from '../../../../models/Patient'
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
        const patient = await Patient.findById(id)
        res.status(200).json({
          success: true,
          data: patient,
        })
      } catch (error) {
        res.status(400).json({ success: false, error: error})
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
