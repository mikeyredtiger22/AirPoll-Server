import * as dbController from './databaseController';
import { getIncentivePointsForDataPoint } from "./incentiveManager";

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
  // get user associated with sensor
  // TODO: only get user obj once, return userID
  dbController.getUserObjectFromSensorID(requestParams.sensorID, (user) => {
    let dataPoint: DataPoint = {
      treatment: user.treatment,
      sensorID: requestParams.sensorID,
      lat: requestParams.lat,
      lng: requestParams.lng,
      value: requestParams.value,
      timestamp: requestParams.timestamp
    };

    // Add sensor data to database
    dbController.pushSensorData(dataPoint, () => {
      // We pass a function to the incentive scheme calculation that allows the calculation method to
      // get data points from the database. This is so that the data point filter is specified in the
      // calculation method, so only the points that are needed are retrieved from the database. Or the
      // method will not be called at all if not needed, this prevents every data point being retrieved
      // every time data from IoT sensors is received.
      getIncentivePointsForDataPoint(dataPoint, user, dbController.getDataPoints, (points) => {

        // add incentive points to user object in database
        dbController.addPointsToUser(dataPoint.sensorID, points, () => {
          callback({dataAdded: true, points: points});
        });
      });
    });
  });
}

function getHeatmapData(requestParams, callback) { //todo give treatment? - one db request
  /* use sensorID:
  can return user's own data in separate object
  can create user if not in DB
  todo return user points (and sensor data history)
   */
  const monthAgoTimestamp = Date.now() - (24 * 3600 * 1000 * 30);
  dbController.getUser(requestParams.userID, (user) => {
    dbController.getHeatmapData(user.treatment, monthAgoTimestamp, heatmapData => {
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
