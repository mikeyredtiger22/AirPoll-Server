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
  .catch(err => {
    console.error(err);
  });
}

//todo create helper class, restructure code

function createUser(callback) {
  getNextTreatment(treatment => {
    db.collection('users').add({
      treatment: treatment,
      points: 0
    })
    .then(ref => {
      callback({userID: ref.id, treatment: treatment});
    })
    .catch(err => {
      console.error(err);
    });
  });
}

function createUserWithID(userID, callback) {
  getNextTreatment(treatment => {
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
  });
}

/**
 * Alternates treatments for new users
 * Todo: Return the smallest treatment group size to add new user to.
 */
function getNextTreatment(callback) { //todo test functionality
  currentTreatment = (currentTreatment === Treatments.TreatmentA) ?
    Treatments.TreatmentB : Treatments.TreatmentA;
  callback(currentTreatment);
}

function pushSensorData(requestBody, callback) {
  console.log(requestBody);
  getUserTreatment(requestBody.userID, treatment => {
    let dataBody = {
      treatment: treatment,
      userID: requestBody.userID,
      lat: requestBody.lat,
      lng: requestBody.lng,
      sensorValue: requestBody.sensorValue,
      acceleration: requestBody.acceleration,
      dateTime: requestBody.dateTime
    };
    db.collection('data').add(dataBody).then(() => {
      getUserPoints(dataBody.userID, points => {
        //todo calculate incentive
        setUserPoints(dataBody.userID, points + 1, () => {
          callback({dataAdded: true});
        });
      });
    });
  })
}

function getUserPoints(userID, callback) {
  getOrCreateUser(userID, userData => {
    callback(userData.points);
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

function getUserTreatment(userID, callback) {
  getOrCreateUser(userID, userData => {
    callback(userData.treatment);
  });
}

function getOrCreateUser(userID, callback) {
  let userRef = db.collection('users').doc(userID);
  userRef.get().then(userDoc => {
    if (userDoc.exists) {
      callback(userDoc.data());
    } else {
      createUserWithID(userID, (userData) => {
        callback(userData);
      });
    }
  })
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
  pushSensorData,
  getAllData
};