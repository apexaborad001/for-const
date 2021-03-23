module.exports = {
  sendSms: async(path, phoneNumber, Message) => {
    try {
      const accountSid = process.env.TWILIO_SSID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      await client.messages.create({
        body: Message,
        from: process.env.FROM_PHONE,
        to: phoneNumber,
        // to: "+917906137742"
      })
      //console.log(`OTP send Successfully ${path}`)
    } catch (err) {
      console.log(`apiPath  - ${path}   \n  Error-    ${err}`)
    }
  }
}