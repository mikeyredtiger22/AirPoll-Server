const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

function returnDataTest(callback) {
  db.collection('newCol1').doc('newDoc2').set({
    name: 1, year: 'two'
  });
  db.collection('newCol').doc('newDoc').get()
    .then(doc =>
      callback(doc.data())
    )
    .catch(err =>
      callback(null, err)
    );
}

export {returnDataTest};