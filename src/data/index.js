import { feature } from 'topojson-client';
import { extent, rollups, sum, cumsum, zip } from 'd3-array';
import perimeter from './perimeters.json';

let { features } = feature(perimeter, 'progression');

features.forEach(
  d => (d.properties.date = +new Date(`${d.properties.date}T00:00:00`))
);

features = features.sort((a, b) => a.properties.date - b.properties.date);

export { features as perimeters };

export const dateRange = extent(features, d => +d.properties.date);

const areas = rollups(
  features,
  v => sum(v, d => d.properties.area),
  d => d.properties.date
);

export const cumulative = zip(
  areas.map(([d]) => d),
  areas.map(([, d]) => d),
  cumsum(areas, ([, d]) => d)
).map(([date, areaToday, areaCumulative]) => ({
  date,
  areaToday,
  areaCumulative
}));
