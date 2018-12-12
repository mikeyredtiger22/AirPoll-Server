import * as incentiveExample from "./Incentives/incentiveExample";
import * as isolationDistanceIncentiveExample from "./Incentives/isolationDistanceIncentiveExample";

let treatmentIncentiveMap = new Map<string, Incentive>([
  // set treatment - incentive mapping here (programmatically)
  ['A', incentiveExample],
  ['B', isolationDistanceIncentiveExample],
  ['C', incentiveExample],
]);

export function getIncentivePointsForDataPoint(dataPoint: DataPoint, user: User, getDataPoints, callback) {
  const incentive = treatmentIncentiveMap.get(user.treatment);

  incentive.calculate(dataPoint, user, getDataPoints, callback);
}

// todo create treatment manager
// todo link treatments to user creation

// export function test() {
//   const mockDataPoint: DataPoint = {
//     sensorID: 'mockData',
//     treatment: 'mockTreatment',
//     lat: 50.93646450414906,
//     lng: -1.396842213630634,
//     value: '99',
//     timestamp: 1111111111111,
//   };
//
//   // let reta: number = incentiveExample.calculate(mockDataPoint);
//   console.log(reta);
// }
