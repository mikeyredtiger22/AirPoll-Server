import {data, application} from "ttn";

const appID = "airpoll-test-network";
// const accessKey = "ttn-account-v2.pUMUIL7wSt01Scde5Z6WiR-QAEw6R90b6CPHpKVMtc0";
const accessKey = "ttn-account-v2.mC19Ku42BQn27kKumxGSFD9V2cVTZoqK7O2Hxgdxtww";

export function start() {

// open mqtt connection / listen to up and down-stream messages
  data(appID, accessKey).then(function (client) {
    client.on("event", function (devID, payload) {
      console.log("Received event from ", devID);
      console.log(payload);
    });

    client.send("test-device-id", { payload: "Hello From Server!"});
  })
  .catch(err => {
    console.error(err);
  });

// application manager client
  application(appID, accessKey).then(function (client) {
    client.get().then(function (app) {
      console.log("Got app", app);
    });
  })
  .catch(err => {
    console.error(err);
  });


}