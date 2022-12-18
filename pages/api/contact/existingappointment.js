import dbConnect from '../../../utils/dbConnect'
import Schedule from '../../../models/Schedule'
import moment from 'moment'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {

        const sched = await Schedule.find(
          {
            $and: [{
              contact: req.body.contact,
              status: "pending",
            }]
          }
          ).sort({date: -1})
        
        
        var tmpSched = []

        let i = 0;
        for(; i < sched.length; i++){
          if(sched[i].date == sched[0].date) tmpSched.push(sched[i])
        }

        if(tmpSched.length != 0){
          var day = (moment(tmpSched[0].date).format("YYYY-MM-DD")+"T"+
          moment(tmpSched[0].time.to).format("hh:mm"))

          var tmpDate = new Date(day)
          const dt2 = new Date()

          console.log(dt2)
          console.log(tmpDate)

          if(dt2 > tmpDate){
            res.status(201).json({ success: true })          
          }else{
            res.status(201).json({ success: false})                    
          }

        }else{
          res.status(201).json({ success: true , message: "first number" }) 
        }
        
      } catch (error) {
        
        res.status(400).json({
          success: false,
          error: error.message,
        })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
