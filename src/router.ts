import * as database from './database';
import * as express from 'express';

let router = express.Router();

router.get('/', function(req, res) {
  res.send("Working!");
});

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

module.exports = router;
