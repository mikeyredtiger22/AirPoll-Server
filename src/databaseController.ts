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
  db.collection('newCol').doc('newDoc').get().then(doc => {
    callback(doc.data());
  })
  .catch(err => {
    console.error(err);
  });
}

function createUser(user: User, callback: (User) => void) {
  let userRef = db.collection('users').doc();
  user.userID = userRef.id;
  userRef.set(user).then(() => {
    callback(user);
  })
  .catch(err => {
    console.error(err);
  });
  //todo remove sensor ID from other users
  //todo think about adding message log for users (created, changed sensorID and why)
}

function getUser(userID: string, callback) {
  db.collection('users').doc(userID).get().then(userDoc => {
    callback(userDoc.data());
  })
  .catch(err => {
    console.error(err);
  });
}

function getUserFromSensorID(sensorID: string, callback) {
  db.collection('users').where('sensorID', '==', sensorID).get().then(userDoc => {
    callback(userDoc);
  })
  .catch(err => {
    console.error(err);
  });
}

function addToUserPoints(sensorID: string, reward: number, callback: () => void) {
  getUserFromSensorID(sensorID, (userDocs) => {
    userDocs.forEach((userDoc) => {
      const newPoints = userDoc.points + reward;
      userDoc.update({points: newPoints}).then(() => {
        callback();
      });
    })
  });
}

function pushSensorData(dataBody, callback) {
  db.collection('data').add(dataBody).then(() => {
    callback();
  })
  .catch(err => {
    console.error(err);
  });
}

function getHeatmapData(treatment, timestampStart, callback) {
  let heatmapData = [];
  db.collection('data')
  .where('treatment', '==', treatment)
  .where('timestamp', '>=', timestampStart)
  .get().then(allData => {
    for (let data of allData.docs) {
      // todo {lat, lng, value} object
      heatmapData.push(data);
    }
    callback(heatmapData);
  })
  .catch(err => {
    console.error(err);
  });
}

function getAllData(callback) {
  db.collection('data').get().then(allData => {
    callback(allData.docs);
  })
  .catch(err => {
    console.error(err);
  });
}

export {
  returnDataTest,
  createUser,
  getUser,
  addToUserPoints,
  pushSensorData,
  getHeatmapData,
  getAllData
};