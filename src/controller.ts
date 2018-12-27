import * as dbController from './databaseController';
import { getIncentivePointsForDataPoint, treatments } from './incentiveManager';

function createUser(requestParams, callback) {
  const sensorID = requestParams.sensorID;
  if (!sensorID) {
    callback({error: 'sensorID not supplied in query parameters'});
    return;
  }
  const timestampNow: number = Date.now();
  const treatment = treatments[Math.floor(Math.random() * treatments.length)];
  const user: User = {
    userID: 'uninitialised', // this is set when object is added to the database
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
}

function getUser(requestParams, callback) {
  dbController.getUser(requestParams.userID, (user) => {
    callback({user: user});
  });
}

function pushSensorData(requestParams, callback) {
  // get user associated with sensor
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
        dbController.addPointsToUser(user, points, () => {
          callback({dataAdded: true, points: points});
        });
      });
    });
  });
}

function getHeatmapData(requestParams, callback) {
  const monthsAgoTimestamp = Date.now() - (24 * 3600 * 1000 * 100);
  dbController.getHeatmapData(requestParams.treatment, monthsAgoTimestamp, heatmapData => {
    callback({heatmapData: heatmapData});
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
