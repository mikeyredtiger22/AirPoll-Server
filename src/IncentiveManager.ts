import * as incentiveExample from "./Incentives/incentiveExample";

let treatmentIncentiveMap = new Map<string, Incentive>([
  // set treatment - incentive mapping here (programmatically)
  ['A', incentiveExample],
  ['B', incentiveExample],
  ['C', incentiveExample],
]);

export function getPointsForDataPoint(dataPoint: DataPoint, user: User) {
  const incentive = treatmentIncentiveMap.get(user.treatment);
  let points: number = incentive.calculate(dataPoint, user);
  // todo get other datapoints from same user and same treatment
  // todo get treatment and incentive scheme and return points
  return points;
}

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
