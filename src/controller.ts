import * as dbController from './databaseController';

/**
 * Alternates treatments for new users
 * Todo: Return the smallest treatment group size to add new user to.
 */
function getNextTreatment(callback) {
  let randomVal = Math.random();
  let treatment = randomVal < 0.3 ? 'A' : randomVal < 0.7 ? 'B' : 'C';
  callback(treatment);
}

function createUser(requestParams, callback) {
  const sensorID = requestParams.sensorID;
  if (!sensorID) {
    callback({error: 'sensorID not supplied in query parameters'});
    return;
  }
  const timestampNow: number = Date.now();
  getNextTreatment((treatment) => {
    const user: User = {
      userID: "uninitialised", // this is set when object is added to the database
      treatment: treatment,
      sensorID: sensorID,
      points: 0,
      messages: {
        [timestampNow]: {
          message: 'Created user with sensorID: ' + sensorID
        }
      },
    };
    dbController.createUser(user, timestampNow, (user) => {
      callback({user: user});
    });
  });
}

function getUser(requestParams, callback) {
  dbController.getUser(requestParams.userID, (user) => {
      callback({user: user});
  });
}

function pushSensorData(requestParams, callback) {
  let dataBody = {
    sensorID: requestParams.sensorID,
    lat: requestParams.lat,
    lng: requestParams.lng,
    value: requestParams.value,
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
  getUser,
  pushSensorData,
  getHeatmapData,
  getAllData,
};
