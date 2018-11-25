import * as admin from 'firebase-admin';
import FieldValue = admin.firestore.FieldValue;

const serviceAccount = require('../firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({timestampsInSnapshots: true});

function migrateData() {
  db.collection('datapoints').get().then(dataPoints => {
    for (let dataPointSnapshot of dataPoints.docs) {
      let dataPoint = dataPointSnapshot.data();
      getRandomVals((treatment, sensorID) => {

        let dateInt = (new Date(dataPoint.date)).getTime();
        let migratingDataPoint = {
          lat: dataPoint.latlng.lat,
          lng: dataPoint.latlng.lng,
          value: dataPoint.value,
          timestamp: dateInt,
          sensorID: sensorID,
          treatment: treatment,
        };

        addMigratingDataPoint(migratingDataPoint);
      });
    }
  })
  .catch(err => {
    console.error(err);
  });
}

function restructureAllData() {
  db.collection('data').get().then(dataPoints => {
    for (let dataPointSnapshot of dataPoints.docs) {

      let dataPointRef = dataPointSnapshot.ref;
      let dataPoint = dataPointSnapshot.data();
      let timestamp = dataPoint.timestamp ? dataPoint.timestamp : (new Date(dataPoint.date)).getTime();
      let lat = dataPoint.lat ? dataPoint.lat : dataPoint.latlng.lat;
      let lng = dataPoint.lat ? dataPoint.lng : dataPoint.latlng.lng;
      getRandomVals((treatment, sensorID) => {
        dataPointRef.update({
          latlng: FieldValue.delete(),
          lat: lat,
          lng: lng,
          value: dataPoint.value,
          timestamp: timestamp,
          sensorID: sensorID,
          treatment: treatment,
        });
      });
    }
  })
  .catch(err => {
    console.error(err);
  });
}

function getRandomVals(callback) {
  let randomVal = Math.random();
  let treatment = randomVal < 0.3 ? 'A' :
    randomVal < 0.7 ? 'B' : 'C';
  let sensorID = 'test' + randomVal.toString()[2] + treatment;
  callback(treatment, sensorID);
}

function addMigratingDataPoint(dataPoint) {
  db.collection('data').add(dataPoint)
  .catch(err => {
    console.error(err);
  });
}

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
      const user: User = userDoc.data();
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
    // if (userDocs.size > 1) {
    //   const userIDs = userDocs.docs.map(userDoc => userDoc.data.userId);
    //   console.error("Should only be one user in database with sensorID: ",
    //     sensorID, "\nFound: ", userIDs.toString());
    // }
    userDocs.forEach((userDoc) => {
      const newPoints = userDoc.points + reward;
      userDoc.update({points: newPoints}).then(() => {
        callback();
      });
    });
  });
}

function pushSensorData(dataBody, callback) {
  db.collection('data').add(dataBody).then((doc) => {
    console.info('Successfully added uplink message data to database with ID: ', doc.id);
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
  migrateData,
  restructureAllData,
  returnDataTest,
  createUser,
  getUser,
  addToUserPoints,
  pushSensorData,
  getHeatmapData,
  getAllData,
};
