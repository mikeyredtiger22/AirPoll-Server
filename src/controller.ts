import * as dbController from './databaseController';

let currentTreatment: Treatments = Treatments.TreatmentA;

/**
 * Alternates treatments for new users
 * Todo: Return the smallest treatment group size to add new user to.
 */
function getNextTreatment(callback) { //todo test functionality
  currentTreatment = (currentTreatment === Treatments.TreatmentA) ?
    Treatments.TreatmentB : Treatments.TreatmentA;
  callback(currentTreatment);
}

function getOrCreateUserWithID(userID, callback) {
  dbController.getUser(userID, user => {
    if (user) {
      callback(user);
    } else {
      getNextTreatment(treatment => {
        dbController.createUserWithID(userID, treatment, callback);
      });
    }
  });
}

function pushSensorData(requestBody, callback) {
  getOrCreateUserWithID(requestBody.userID, (user) => {
    let dataBody = {
      treatment: user.treatment,
      userID: requestBody.userID,
      // lat: requestBody.lat,
      // lng: requestBody.lng,
      // sensorValue: requestBody.sensorValue,
      // acceleration: requestBody.acceleration,
      // dateTime: requestBody.dateTime
    };
    dbController.pushSensorData(dataBody, () => {
      //todo calculate incentive
      dbController.setUserPoints(dataBody.userID, user.points + 1, () => {
        callback({dataAdded: true});
      });
    });
  });
}

//todo: generate timestamp, to heatmap types, test api

function getAllData(callback) {
  dbController.getAllData(callback);
}

export {
  pushSensorData,
  getAllData
};