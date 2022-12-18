import dbConnect from '../../../utils/dbConnect'
import Schedule from '../../../models/Schedule'
import moment from 'moment'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {

    case 'POST':
        try {
            const getCount = await Schedule.find({
                $and: [
                    { 
                        date: {
                            $gte: moment().startOf('month').format('YYYY-MM-DD'),
                            $lte: moment().endOf('month').format('YYYY-MM-DD')
                        }
                    },
                    {
                        status:"pending"
                    }
                ]
            })

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