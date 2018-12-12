export const calculate: CalcMethod = (dataPoint: DataPoint, user: User, getDataPoints, callback) => {
  const monthsAgoTimestamp = Date.now() - (24 * 3600 * 1000 * 100);
  getDataPoints(user.treatment, monthsAgoTimestamp, (otherDataPoints) => {
    const firstPoint: DataPoint = otherDataPoints[0];
    callback( parseInt(firstPoint.value) + 500);
  });
  /**
   * todo Steps:
   * Get all data points with filer:
   *     same treatment
   *     within last hour or so
   *     ±lat range
   *     ±lng range
   * then loop through all points to find minimum distance
   * if minimum is less than certain distance, get points/bonus
   *
   * This could be bad, ratherrr.. divide map into latlng squares,
   * points for first person to collect data in any square each hour.
   *
   * And/Or: bonus points if no data in current square within last hour! (best)
   */
  return 3;
};
