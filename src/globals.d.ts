
interface User {
  userID: string,
  treatment: string,
  sensorID: string,
  points: number,
  created: number,
}

declare const enum Treatments {
  TreatmentA = 'treatmentA',
  TreatmentB = 'treatmentB'
}
