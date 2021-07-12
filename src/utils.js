import { feature } from 'topojson-client';
import { extent, rollups, sum, cumsum, zip } from 'd3-array';

export const parseData = data => {
  let { features } = feature(data, 'progression');

  features.forEach(
    d => (d.properties.date = +new Date(`${d.properties.date}T00:00:00`))
  );

  const perimeters = features.sort(
    (a, b) => a.properties.date - b.properties.date
  );

  const dateRange = extent(features, d => +d.properties.date);

  const areas = rollups(
    features,
    v => sum(v, d => d.properties.area),
    d => d.properties.date
  );

  const cumulative = zip(
    areas.map(([d]) => d),
    areas.map(([, d]) => d),
    cumsum(areas, ([, d]) => d)
  ).map(([date, areaToday, areaCumulative]) => ({
    date,
    areaToday,
    areaCumulative
  }));

  return {
    perimeters,
    dateRange,
    cumulative
  };
};
