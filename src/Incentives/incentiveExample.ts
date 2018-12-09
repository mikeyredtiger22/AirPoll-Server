export const calculate: CalcMethod = (dataPoint: DataPoint, user: User, otherDataPoints: DataPoint[]) => {
  return parseInt(dataPoint.value);
};
