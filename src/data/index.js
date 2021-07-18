import { feature } from 'topojson-client';
import { extent } from 'd3-array';
import { calculateCumulative } from '../utils';
import data from './perimeters.json';
import active from './active.json';

let { features } = feature(data, 'progression');

features.forEach(d => {
  d.properties.date = +new Date(`${d.properties.date}T00:00:00`);
});

const perimeters = features
  .sort((a, b) => a.properties.date - b.properties.date)
  .map((d, i) => {
    d.properties.id = i;
    return d;
  });

const dateRange = extent(features, d => +d.properties.date);

const cumulative = calculateCumulative(features);

active.forEach((d, i) => {
  d.startDate = new Date(d.startDate);
  d.id = i;
});

export { perimeters, dateRange, cumulative, active };
