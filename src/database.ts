import * as admin from 'firebase-admin';

const serviceAccount = require('../firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

enum Treatments {
  TreatmentA = 'treatmentA',
  TreatmentB = 'treatmentB'
}

let currentTreatment: Treatments = Treatments.TreatmentA;

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

function createUser(callback) {
  getNextTreatment(treatment => {
    db.collection('users').add({
      treatment: treatment,
      points: 0
    })
    .then(ref => {
      callback({userID: ref.id, treatment: treatment})
    })
    .catch(err => {
      //todo error
    });
  });
}

/**
 * Returns the smallest treatment group size to add new user to.
 */
function getNextTreatment(callback) { //todo test functionality
  currentTreatment = (currentTreatment === Treatments.TreatmentA) ?
    Treatments.TreatmentB : Treatments.TreatmentA;
  callback(currentTreatment);
}

function pushSensorData(requestBody, callback) {
  let dataBody = {
    treatment: requestBody.treatment,
    userID: requestBody.userID,
    lat: requestBody.lat,
    lng: requestBody.lng,
    sensorValue: requestBody.sensorValue,
    acceleration: requestBody.acceleration,
    dateTime: requestBody.dateTime
  };
  //todo validate treatment value
  db.collection('data').doc(requestBody.treatment).collection('data').add(dataBody)
  .then(callback({dataAdded: true}));
  //todo calculate and return points
}

//doc(treatment).collection('users')

function getAllData(callback) {
  db.collection('data').get()
  .then(snapshot => {
    callback(snapshot.docs);
  })
}

export {
  returnDataTest,
  createUser,
  pushSensorData,
  getAllData
};