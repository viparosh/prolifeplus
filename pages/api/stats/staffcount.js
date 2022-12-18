import dbConnect from '../../../utils/dbConnect'
import Users from '../../../models/User'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {

    case 'POST':
        try {
            const getCount = await Users.find({role:req.body.role})

            if(getCount){
                res.status(200).json({
                    success: true,
                    data: getCount,
                })
            }else{
                res.status(400).json({ success: false })    
            }
        } catch (error) {
            res.status(400).json({ success: false })
        }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}