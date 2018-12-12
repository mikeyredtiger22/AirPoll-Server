export const calculate: CalcMethod = (dataPoint: DataPoint, user: User, getDataPoints, callback) => {
  const monthsAgoTimestamp = Date.now() - (24 * 3600 * 1000 * 100);
  getDataPoints(user.treatment, monthsAgoTimestamp, (otherDataPoints) => {
    // Filter: within 500m box around data point (±250m each side)
    let filteredDataPoints = otherDataPoints.filter(otherDataPoint =>
      // latitude (north/south), ±100m ~=~ ±0.01 lat (in uk)
      // longitude (east/west), ±100m ~=~ ±0.002 lng (in uk)
      otherDataPoint.lat >= (dataPoint.lat - 0.025) &&
      otherDataPoint.lat <= (dataPoint.lat + 0.025) &&
      otherDataPoint.lng >= (dataPoint.lng - 0.005) &&
      otherDataPoint.lng <= (dataPoint.lng + 0.005)
    );

    const pointsInSpaceTimeArea = filteredDataPoints.length;
    // Note: this incentive scheme implementation can be abused / is unfair
    const points = pointsInSpaceTimeArea < 10 ? 10 - pointsInSpaceTimeArea : 1;
    callback(points);
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
};
