const firebase = require('firebase-admin');
var notificationAcc = require('../eventapp-10ecc-firebase-adminsdk-fbsvc-70392851a7.json');
const notification = () => {
  return firebase.initializeApp(
    {
      credential: firebase.credential.cert(notificationAcc)
    }
  );
};
module.exports = { notification };