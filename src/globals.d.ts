
declare interface User {
  userID: string,
  treatment: string,
  sensorID: string,
  points: number,
  messages: {},
}

declare interface dataPoint {
  lat: number,
  lng: number,
  timestamp: number,
  sensorID: string,
  treatment: string,
  value: string
}

declare interface Incentive {
  calculatePoints: (dataPoint: dataPoint) => number;
}

declare type CalcMethod = (dataPoint: dataPoint) => number;
