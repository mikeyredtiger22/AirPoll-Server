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

function createUser(requestParams, callback) {
  getNextTreatment((treatment) => {
    let user: User = {
      userID: "uninitialised",
      treatment: treatment,
      sensorID: requestParams.sensorID,
      points: 0,
      messages: [{timestamp: Date.now(),
        message: 'Created user with sensorID: ' + requestParams.sensorID}],
    };
    dbController.createUser(user, (user) => {
      callback({user: user});
    });
  });
}

function pushSensorData(requestParams, callback) {
  let dataBody = {
    sensorID: requestParams.sensorID,
    lat: requestParams.lat,
    lng: requestParams.lng,
    value: requestParams.value,
    accel: requestParams.accel,
    timestamp: requestParams.timestamp
  };
  dbController.pushSensorData(dataBody, () => {
    //todo calculate incentive
    const reward = 1;
    dbController.addToUserPoints(dataBody.sensorID, reward, () => {
      callback({dataAdded: true, reward: reward});
    });
  });
}

function getHeatmapData(requestParams, callback) {
  /* use sensorID:
  can return user's own data in separate object
  can create user if not in DB
  todo return user points (and sensor data history)
   */
  const dayAgoTimestamp = Date.now() - (24 * 3600 * 1000);
  dbController.getUser(requestParams.userID, (user) => {
    dbController.getHeatmapData(user.treatment, dayAgoTimestamp, heatmapData => {
      callback({heatmapData: heatmapData});
    });
  });
}

function getAllData(callback) {
  dbController.getAllData(callback);
}

export {
  createUser,
  pushSensorData,
  getHeatmapData,
  getAllData
};