
interface User {
  ID: string,
  treatment: string,
  points: number,
}

declare const enum Treatments {
  TreatmentA = 'treatmentA',
  TreatmentB = 'treatmentB'
}
