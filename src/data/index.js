import circle from '@turf/circle';
import { feature } from 'topojson-client';
import { extent } from 'd3-array';
import perimeter from './perimeters.json';

const perimeters = feature(perimeter, 'progression');

perimeters.features.forEach(
  d => (d.properties.date = new Date(d.properties.date))
);

export { perimeters };

export const dateRange = extent(perimeters.features, d => +d.properties.date);
