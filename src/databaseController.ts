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
  removeSensorIDFromOtherUsers(user.sensorID, () => {
    addNewUserToDb(user, callback);
  });
}

function removeSensorIDFromOtherUsers(sensorID: string, callback: () => void) {
  getUsersWithSensorID(sensorID, (userDocs) => {
    for (let userDoc of userDocs.docs) {
      const data = userDoc.data;
      //todo
    }
    callback();
  });
}

function removeSensorIDFromUser(doc, callback) {

}

function addNewUserToDb(user: User, callback: (User) => void) {
  let userRef = db.collection('users').doc();
  user.userID = userRef.id;

  userRef.set(user).then(() => {
    callback(user);
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

function getUsersWithSensorID(sensorID: string, callback) {
  db.collection('users').where('sensorID', '==', sensorID).get().then(userDocs => {
    callback(userDocs);
  })
  .catch(err => {
    console.error(err);
  });
}

function addToUserPoints(sensorID: string, reward: number, callback: () => void) {
  getUsersWithSensorID(sensorID, (userDocs) => {
    userDocs.forEach((userDoc) => {
      const newPoints = userDoc.points + reward;
      userDoc.update({points: newPoints}).then(() => {
        callback();
      });
    });
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
    for (let dataDoc of allData.docs) {
      const data = dataDoc.data; //fix
      heatmapData.push({
        lat: data.lat,
        lng: data.lng,
        value: data.value,
      });
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