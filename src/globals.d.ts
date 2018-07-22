
interface User {
  userID: string,
  treatment: string,
  sensorID: string,
  points: number,
  messages: [{timestamp: number, message: string}],
}

declare const enum Treatments {
  TreatmentA = 'treatmentA',
  TreatmentB = 'treatmentB'
}
