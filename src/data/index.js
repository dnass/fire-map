import { feature } from 'topojson-client';
import { extent } from 'd3-array';
import perimeter from './perimeters.json';

const { features } = feature(perimeter, 'progression');

features.forEach(d => (d.properties.date = +new Date(d.properties.date)));

export { features as perimeters };

export const dateRange = extent(features, d => +d.properties.date);
