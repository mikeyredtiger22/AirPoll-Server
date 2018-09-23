import * as controller from './controller';
import { data, application } from "ttn";

const appID = "airpoll-test-network";
// const accessKey = "ttn-account-v2.pUMUIL7wSt01Scde5Z6WiR-QAEw6R90b6CPHpKVMtc0";
const accessKey = "ttn-account-v2.mC19Ku42BQn27kKumxGSFD9V2cVTZoqK7O2Hxgdxtww";

export function setupTtnListeners() {
// The Things Network - IoT Device message listener
  data(appID, accessKey).then(function (client) {
    // Listen to all events
    client.on("event", function (devID, payload) {
      const data = payload.message.payload_fields;
      console.log("Received event from '", devID, "' containing: ", data);
    });

    // From Device
    client.on("uplink", function (devID, payload) {
      console.info("UPLINK ", devID, "\nPayload: ", payload);
      try {
        let hexByteArray = JSON.stringify(payload.payload_raw);
        let str = String.fromCharCode.apply(String, JSON.parse(hexByteArray).data);
        let dataJson = JSON.parse(str);
        controller.pushSensorData(dataJson, () => {});
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
    client.send("test-device-id", dataBody, 1, true);
  })
  .catch(err => {
    console.error(err);
  });

// application manager client
  // application(appID, accessKey).then(function (client) {
  //   // client.registerDevice("test-device-id", null).then(function () {
  //   //   console.log('registered device ');
  //   // });
  //   client.devices().then(function (devs) {
  //     console.log(devs);
  //   });
  //   client.device("test-device-id", null).then(function (dev) {
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
