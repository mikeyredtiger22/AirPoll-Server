import * as admin from 'firebase-admin';

const serviceAccount = require('../firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

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

function createUser(user: User, timestampNow: number, callback: (User) => void) {
  removeSensorIDFromOtherUsers(user.sensorID, timestampNow, () => {
    addNewUserToDb(user, callback);
  });
}

function removeSensorIDFromOtherUsers(sensorID: string, timestampNow: number, callback: () => void) {
  getUsersWithSensorID(sensorID, (userDocs) => {
    for (let userDoc of userDocs.docs) {
      const user: User = userDoc.data;
      //calls are not chained so they can be batched.
      removeSensorIDFromUser(user, timestampNow);
    }
    callback();
  });
}

function removeSensorIDFromUser(user: User, timestampNow: number) {
  const newMessagePath = 'messages.' + timestampNow.toString() + '.message';
  db.collection('users').doc(user.userID).update({
    sensorID: '',
    [newMessagePath]: 'sensorID removed.',
  })
  .catch(err => {
    console.error(err);
  });
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
      // @ts-ignore
      const data: dataPoint = dataDoc.data;
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