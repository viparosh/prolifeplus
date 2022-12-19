export default async (req, res) => {
  const { method } = req
  switch (method) {
    case 'POST':
      try{

        const { Vonage } = require('@vonage/server-sdk');

        const vonage = new Vonage({
            apiKey: process.env.VONAGE_API_KEY,
            apiSecret: process.env.VONAGE_API_SECRET,
            signatureSecret: process.env.VONAGE_SIGNATURE_SECRET,
            signatureMethod: "MD5 HASH signature"
        }, { debug: true } )  

        const resp = await vonage.sms.send({to: `63${req.body.contact}`, from: 'Vonage APIs', 
          text: `Greetings, ${req.body.patientName} !\n\nPlease come to Blessed Hope Maternity and Lying-in Clinic at ${req.body.date}. Your schedule is ${req.body.timeslot}
                  If you want to cancel the appointment , visit https://prolifecommunity.vercel.app/cancellation , your cancellation code is: ${req.body.cancellationCode}\n\n`}).
          then(res => console.log(res)).
          catch(err => console.log(err.message))
        
        res.status(200).json({ success: true })
      
      }catch(error){
        res.status(200).json({ success: false , message: error.message})
      }

      break

    default:
      res.status(400).json({ success: false })
      break
  }
}
