declare interface User {
  userID: string,
  treatment: string,
  sensorID: string,
  points: number,
  messages: {},
}

declare interface DataPoint {
  lat: number,
  lng: number,
  timestamp: number,
  sensorID: string,
  treatment: string,
  value: string
}

declare interface Incentive {
  calculate: (dataPoint: DataPoint, user: User,  otherDataPoints: DataPoint[]) => number;
}

declare type CalcMethod = (dataPoint: DataPoint, user: User, otherDataPoints: DataPoint[]) => number;
