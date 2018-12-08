import * as IncentiveExample from "./Incentives/IncentiveExample";

// Single object to access all incentives, make sure to import and add all new incentives to list
export {
  IncentiveExample,
}

// todo create treatments and pair with examples

const mockDataPoint: dataPoint = {
  sensorID: 'mockData',
  treatment: 'mockTreatment',
  lat: 50.93646450414906,
  lng: -1.396842213630634,
  value: '99',
  timestamp: 1111111111111,
};

let reta: number = IncentiveExample.calculate(mockDataPoint);
console.log(reta);

// todo: method to take pushedSensorData, get treatment, get incentive scheme,
//  give incentive scheme helper data / methods, run incentive scheme, return points
