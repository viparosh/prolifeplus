import dbConnect from '../../../../utils/dbConnect'
import Users from '../../../../models/User'

dbConnect()

export default async (req, res) => {
  
  const {  
    query: { id },
    method } = req

  switch (method) {
    case 'PUT':
       try {
          const user = await Users.findById(id)
   
          if(user.password == req.body.oldPassword){
            const userData = await Users.findByIdAndUpdate(id, req.body, {
              new: true,
              runValidators: true,
            })

            if (!userData) {
              return res.status(400).json({ success: false })
            }

            res.status(200).json({ success: true, data: userData })
          }else{
            return res.status(400).json({ success: false , message: "Incorrect old password" })
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