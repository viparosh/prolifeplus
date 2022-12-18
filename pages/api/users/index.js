import dbConnect from '../../../utils/dbConnect'
import Users from '../../../models/User'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {
    
    //change contact

    case 'PUT':
      try {
        const patient = await Users.findOne({username:req.body.username})

        if(patient){
          
          const subPatient = await Users.findByIdAndUpdate(
            patient._id,
            { 
              username:req.body.newUsername 
            }
          )

          if(subPatient) console.log("contact changed")

          res.status(200).json({ success: true, data: patient })
        }else{
          res.status(400).json({ success: false, data: patient })
        }

      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'GET':
      try {
        const userData = await Users.find()
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
        const userData = await Users.create(req.body)
        res.status(201).json({ success: true, data: userData })
      } catch (error) {
        res.status(400).json({
          success: false,
          error:error?.code == "11000"? "Username exists" : "Missing fields"
        })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}