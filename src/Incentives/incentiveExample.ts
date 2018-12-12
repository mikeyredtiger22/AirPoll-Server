export const calculate: CalcMethod = (dataPoint: DataPoint, user: User, getDataPoints, callback) => {
  callback(parseInt(dataPoint.value));
};
