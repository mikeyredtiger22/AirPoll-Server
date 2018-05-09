import * as database from './database';
import * as express from 'express';

let router = express.Router();

//Test API
router.get('/api', function(req, res) {
  res.send("Working!");
});

//Test Database
router.get('/data', function(req, res) {
  database.returnDataTest((data, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
    res.json(data);
  });
});

//Create User
router.post('/user', function (req, res) {
  database.createUser(result => {
    res.json(result);
  })
});

//Push Sensor Data
router.post('/', function (req, res) {
  //todo get data (sensorValue, lat, lng, dateTime, userID, acceleration)
  //todo add data to database for treatment
  //todo return points
});

//Get HeatMap Data
router.get('/', function (req, res) {
  //todo get all sensor data for treatment
  //todo plan heatmap usage on all platforms
  //todo calculate and anonymise data
  //todo return heatmap data
});

//Get Raw Data
router.get('/allData', function (req, res) {
  //todo authenticate request
  //todo return all data from database
  //todo test bandwidth / high data load
});

module.exports = router;
