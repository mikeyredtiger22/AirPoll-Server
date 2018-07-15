import * as controller from './controller';
import * as dbController from './databaseController';
import * as express from 'express';

let router = express.Router();

//Test API
router.get('/api', function(req, res) {
  res.send("Working!");
});

//Test Database
router.get('/data', function(req, res) {
  dbController.returnDataTest((data, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
    res.json(data);
  });
});

//Push Sensor Data
router.post('/', function (req, res) {
  //todo validate that all fields are received
  controller.pushSensorData(req.body, result => {
    res.json(result);
  });
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
  controller.getAllData(data => res.json(data));
  //todo test bandwidth / high data load
});

module.exports = router;
