import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Push.Configure({
    gcm: {
      apiKey: 'AAAACn9wlcI:APA91bF-M0LmBmjV5nixSb8Pn4ym58kFgyGrnakOEEHILyNEZ0pRejMBH5O66xh8I8gqMWcWJbeO-7mXrXbXYVTbr2iJsnGxbNRX2f7ADynES0WlyjLYuB4mNIRzUZN5DRGifVWhxfCu',
      projectNumber: 45087757762
    },
  // production: true,
  // 'sound' true,
  // 'badge' true,
  // 'alert' true,
  // 'vibrate' true,
  // 'sendInterval': 15000, Configurable interval between sending
  // 'sendBatchSize': 1, Configurable number of notifications to send per batch
  // 'keepNotifications': false,
})
});

Meteor.methods({
 sendPush: function() {
  return Push.send({
   from: 'Test',
      title:'Greetings',
      text:'Hello world!',
      badge: 3,
      query: {},
    });
   },
});
