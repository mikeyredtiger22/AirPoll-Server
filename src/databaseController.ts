import * as admin from 'firebase-admin';

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
  .then(doc => {
    callback(doc.data());
  })
  .catch(err => {
    console.error(err);
  });
}

function createUser(treatment: string, callback: (User) => void) {
  let userRef = db.collection('users').doc();
  let user = {
    ID: userRef.id,
    treatment: treatment,
    points: 0
  };
  userRef.set(user).then(() => {
    callback(user);
  })
  .catch(err => {
    console.error(err);
  });
}

function createUserWithID(userID, treatment, callback) {
  let userData = {
    treatment: treatment,
    points: 0
  };
  db.collection('users').doc(userID).set(userData).then(() => {
    callback(userData);
  })
  .catch(err => {
    console.error(err);
  });
}

function getUser(userID: string, callback) {
  db.collection('users').doc(userID).get().then(userDoc => {
    callback(userDoc.data());
  })
  .catch(err => {
    console.error(err);
  });
}

function setUserPoints(userID, points, callback) {
  db.collection('users').doc(userID).set({points: points}).then(() => {
    callback();
  })
  .catch(err => {
    console.error(err);
  });
}

function pushSensorData(dataBody, callback) {
  db.collection('data').add(dataBody).then(callback())
  .catch(err => {
    console.error(err);
  });
}

function getAllData(callback) {
  db.collection('data').get()
  .then(snapshot => {
    callback(snapshot.docs);
  })
}

export {
  returnDataTest,
  createUser,
  createUserWithID,
  pushSensorData,
  getUser,
  setUserPoints,
  getAllData
};