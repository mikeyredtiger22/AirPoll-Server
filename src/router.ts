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
  controller.pushSensorData(req.query, result => {
    res.json(result);
  });
});

//Get HeatMap Data
router.get('/', function (req, res) {
  console.log(req.query);
  res.send();
  //TODO: https://www.npmjs.com/package/express-validator
  controller.getHeatmapData(req.query, result => {
    res.json(result);
  });
});

//Get Raw Data
router.get('/allData', function (req, res) {
  //todo authenticate request
  controller.getAllData(data => res.json(data));
  //todo test bandwidth / high data load
});

module.exports = router;
