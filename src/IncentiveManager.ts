import * as incentiveExample from "./Incentives/incentiveExample";
import * as isolationDistanceIncentiveExample from "./Incentives/isolationDistanceIncentiveExample";

// Used in user creation
export const treatments = ['A', 'B', 'C'];

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
