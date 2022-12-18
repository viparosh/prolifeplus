import dbConnect from '../../../utils/dbConnect'
import Schedule from '../../../models/Schedule'
import Calendar from '../../../models/Calendar'

dbConnect()

export default async (req, res) => {
  const { method } = req

  switch (method) {

    case 'POST':
      try {
        const sched = await Schedule.findOne(
            { $and: [{
            serverCancellationCode:req.body.serverCancellationCode,
            contact:req.body.contact }
        ]})

        if(sched){
          
          //find the day in Calendar
           
          const day = await Calendar.findOne({date:sched.date})
            if(day){

              if(sched.consultation == "obgyne"){    
                var z = 0
                for(; z < day.obgyn_schedule.length; z++) if(day.obgyn_schedule[z].schedID == sched.time.schedID) break
                res.status(200).json({ success: true, mainID: day._id, subID: day.obgyn_schedule[z]._id, data: sched })
              }else{
                var z = 0
                for(; z < day.midWife_schedule.length; z++) if(day.midWife_schedule[z].schedID == sched.time.schedID) break
                res.status(200).json({ success: true, mainID: day._id, subID: day.midWife_schedule[z]._id, data: sched })
              }
            
            }
        
        }else{
          res.status(400).json({ success: false, message: "Invalid code or phone number" })
        }

      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT':
      try {
          var resCalendar; 

          if(req.body.consultation == "obgyne"){
            resCalendar = await Calendar.findOneAndUpdate({ _id: req.body.mainID, "obgyn_schedule._id": req.body.subID },
            {
                $set: {
                  "obgyn_schedule.$.status": false,
                }
            },
            {
              new: true,
              runValidators: true,
            })
          }else{
            resCalendar = await Calendar.findOneAndUpdate({ _id: req.body.mainID, "midWife_schedule._id": req.body.subID },
            {
                $set: {
                  "midWife_schedule.$.status": false,
                }
            },
            {
              new: true,
              runValidators: true,
            })
          }
      

          if(resCalendar){
            // res.status(200).json({ success: true, message: resCalendar })
  
            const updateSched = await Schedule.findOneAndUpdate(
              { $and: [{
              serverCancellationCode:req.body.serverCancellationCode,
              contact:req.body.contact }
            ]} , {$set: {status:"cancelled"}} )

            if(updateSched){
              res.status(200).json({ success: true, message: updateSched })
            }

          }else{
            res.status(400).json({ success: false , message: "Update error"})   
          }
         
      } catch (error) {
        res.status(400).json({ success: false , message: error})       
      }
      break
    case 'DELETE':
      try{
        const delSched = await Schedule.deleteOne({ _id:req.body.id})

        if(delSched){
          res.status(200).json({ success: true, message: "Schedule has been cancelled !" })
        }
      }catch(error){
        res.status(400).json({ success: false , message: error})      
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}