
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
  value: number,
}

declare const enum Treatments {
  TreatmentA = 'treatmentA',
  TreatmentB = 'treatmentB'
}
