import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // // Set up a Twilio account, right now it is in free trial mode
  // // Need credientials, located in Twilio Dashboard
  // accountSID = 'AC79dd2984feb4f0f2b738caa611eee408'
  // authToken = 'f06fcbaa9603fe7212fe2cb695e524c9'
  // // Need to buy a phone number from Twilio
  // userPhone = '+19284880882'
  // twilioPhone = '+19285506526'
  // message = 'Hello World.'
  //
  // // Calls Twilio API
  // twilio = Twilio(accountSID, authToken);
  // // Sends SMS message to user
  // twilio.sendSms({
  //   to: userPhone,
  //   from: twilioPhone,
  //   body:  message
  // },
  // // Checks to see if response is received from Twilio
  // function(err, responseData) {
  //   // if there's no errors on sending SMS Message to user's phone number
  //   if (!err) {
  //     // "responseData" is a JavaScript object containing data received from Twilio.
  //     // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
  //     // http://www.twilio.com/docs/api/rest/sending-sms#example-1
  //
  //     // outputs the phone number from Twilio
  //     console.log(responseData.from);
  //     // outputs message
  //     console.log(responseData.body);
  //   }
  // });
});

Meteor.methods({
  sendTextMessage(){
    // code to run on server at startup
    // Set up a Twilio account, right now it is in free trial mode
    // Need credientials, located in Twilio Dashboard
    accountSID = 'AC79dd2984feb4f0f2b738caa611eee408'
    authToken = 'f06fcbaa9603fe7212fe2cb695e524c9'
    // Need to buy a phone number from Twilio
    userPhone = '+19284880882'
    twilioPhone = '+19285506526'
    message = 'Hello World.'

    // Calls Twilio API
    twilio = Twilio(accountSID, authToken);
    // Sends SMS message to user
    twilio.sendSms({
      to: userPhone,
      from: twilioPhone,
      body:  message
    },
    // Checks to see if response is received from Twilio
    function(err, responseData) {
      // if there's no errors on sending SMS Message to user's phone number
      if (!err) {
        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        // outputs the phone number from Twilio
        console.log(responseData.from);
        // outputs message
        console.log(responseData.body);
      }
    });
  }
});
