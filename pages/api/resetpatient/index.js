import dbConnect from '../../../utils/dbConnect'
import Users from '../../../models/User'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {
    case 'DELETE':
      try {
        const sessionData = await Users.deleteMany({
         role: "patient" })
        
        if(sessionData){
          res.status(200).json({
            success: true,
            data: sessionData,
          })
        }else{
          res.status(400).json({
            success: false,
            data: "reset failed",
          })
        } 
       
      } catch (error) {
        res.status(400).json({ success: false , message: error})
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
