import dbConnect from '../../../../utils/dbConnect'
import Users from '../../../../models/User'

dbConnect()

export default async (req, res) => {
  
  const { method } = req

  switch (method) {
    case 'PUT':
       try {
          const user = await Users.findOne({username:req.body.contact})
          
          if(user){
            
            const userData = await Users.findByIdAndUpdate(user._id, {password:"blessedhope"}, {
              new: true,
              runValidators: true,
            })

            if (!userData) {
              res.status(400).json({ success: false })
            }else{
              res.status(200).json({ success: true, data: userData })
            }

          }else{
            res.status(400).json({success:false,data:"Patient not found"})
          }

  
        
      } catch (error) {
        res.status(400).json({ success: false, message:error.message })
      }

      break
    default:
      res.status(400).json({ success: false })
      break
  }
}