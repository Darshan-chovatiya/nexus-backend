const firebase = require('firebase-admin');
var notificationAcc = require('../firebasecredential.json').notification;
const notification = () => {
  return firebase.initializeApp(
    {
      credential: firebase.credential.cert(notificationAcc)
    },
    'notification'
  );
};
module.exports = { notification };