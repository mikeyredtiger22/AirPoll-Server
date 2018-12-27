import * as controller from './controller';
import { data, application } from 'ttn';
const { appID, accessKey} = require('../ttn-credentials.json');

export function setupTtnListeners() {
// The Things Network - IoT Device message listener
  data(appID, accessKey).then(function (client) {
    // Listen to all events
    client.on('event', function (devID, payload) {
      const data = payload.message.payload_fields;
      console.log('Received event from \'', devID, '\' containing: ', data);
    });

    // From Device
    client.on('uplink', function (devID, payload) {
      console.info('UPLINK ', devID, '\nPayload: ', payload);
      let sensorID = payload.dev_id;
      let messageTime = payload.metadata.time; //todo to UTC time int
      try {
        let value = Buffer.from(payload.payload_raw, 'base64').toString('ascii');
        console.log(value);
        let dataBody = {
          sensorID: sensorID,
          lat: 50.93646450414906,
          lng: -1.396842213630634,
          value: value,
          timestamp: 11111111111111,
        };
        // controller.pushSensorData(dataBody, () => {});
      } catch (err) {
        console.error(err);
      }
    });

    let dataBody = {
      sensorID: 'test-sensor-id',
      lat: 50.93646450414906,
      lng: -1.396842213630634,
      value: 69,
      timestamp: 11111111111111,
    };
    // client.send('system000', dataBody, 1, true);
  })
  .catch(err => {
    console.error(err);
  });

// application manager client
  // application(appID, accessKey).then(function (client) {
  //   // client.registerDevice('test-device-id', null).then(function () {
  //   //   console.log('registered device ');
  //   // });
  //   client.devices().then(function (devs) {
  //     console.log(devs);
  //   });
  //   client.device('test-device-id', null).then(function (dev) {
  //     console.log('registered device saad', dev);
  //   });
  //   client.get().then(function (app) {
  //
  //   });
  // })
  // .catch(err => {
  //   console.error(err);
  // });

}
