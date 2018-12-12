/**
 * Explanation: Most fair space & time incentive scheme (I can think of):
 * The aim of the experiment is to get a good coverage of wide spread data.
 *
 * Split map into 200m X 200m squares. So for each point we round the latitude to the nearest 0.01,
 * and for longitude the nearest 0.002, this gives us the 'box' that the point is in.
 * We reward more points the more we need data in that area (time since last data point in that area)
 *
 * (Always make sure we give more points for more data, no long term benefit for giving worse data)
 */
export const calculate: CalcMethod = (dataPoint: DataPoint, user: User, getDataPoints, callback) => {
  const twoMonthsAgoTimestamp = Date.now() - (24 * 3600 * 1000 * 60);
  getDataPoints(user.treatment, twoMonthsAgoTimestamp, (otherDataPoints) => {
    const lngFloatString = dataPoint.lng.toFixed(3); // nearest 0.001
    const lastDigitLng = parseInt(lngFloatString.slice(-1));
    const lastDigitLngEven = (lastDigitLng % 2 == 0) ? lastDigitLng : lastDigitLng - 1;

    const boxLng = parseFloat(lngFloatString.slice(0, -1) + lastDigitLngEven); // nearest 0.002
    const boxLat = parseFloat(dataPoint.lat.toFixed(2)); // nearest 0.01

    console.log('latBB: ', boxLat);
    console.log('lngBB: ', boxLng);

    let filteredDataPoints = otherDataPoints.filter(otherDataPoint =>
      // latitude (north/south), ±100m ~=~ ±0.01 lat (in uk)
      // longitude (east/west), ±100m ~=~ ±0.002 lng (in uk)
      otherDataPoint.lat >= (boxLat) &&
      otherDataPoint.lat < (boxLat + 0.01) &&
      otherDataPoint.lng >= (boxLng) &&
      otherDataPoint.lng < (boxLng + 0.02)
    );
    const timeNow = Date.now();
    // data points are ordered descending by time
    const lastDataPointTime = filteredDataPoints[0].timestamp;
    const hoursSinceLast = (timeNow - lastDataPointTime) / (1000 * 60 * 60);
    const points =
      hoursSinceLast < 0.2 ? 10 :
      hoursSinceLast < 0.5 ? 20 :
      hoursSinceLast < 1   ? 30 :
      hoursSinceLast < 2   ? 50 :
      hoursSinceLast < 5   ? 100 :
      hoursSinceLast < 20  ? 150 : 300;

    const pointsInSpaceTimeArea = filteredDataPoints.length;
    console.log(pointsInSpaceTimeArea);
    callback(points);
  });
};
