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

        const resp = await vonage.sms.send({to: `63${req.body.mobile_number}`, from: 'Vonage APIs', 
          text: `Blessed Hope Maternity Lying-in Clinic\n\n Your verification code is ${req.body.verification_code}\n\n`}).
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

