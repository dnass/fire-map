import mapshaper from 'mapshaper';
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

const files = ['progression.shp', 'progression.prj', 'progression.dbf'];

const BASE_URL = 'https://cwfis.cfs.nrcan.gc.ca/downloads/hotspots/';

const data = await Promise.all(
  files.map(file => fetch(`${BASE_URL}${file}`).then(res => res.buffer()))
);

const input = files.reduce((obj, filename, i) => {
  obj[filename] = data[i];
  return obj;
}, {});

const cmd = `-i progression.shp -proj wgs84 -clean -each 'd = DATE + ""; this.properties = { date: [d.slice(0,4), d.slice(4,6), d.slice(6,8)].join("-"), area: AREA }' -o out.json format=topojson`;

const { 'out.json': output } = await mapshaper.applyCommands(cmd, input);

writeFileSync('src/data/perimeters.json', output);

const ACTIVE_URL =
  'https://cwfis.cfs.nrcan.gc.ca/geoserver/public/wfs?SERVICE=WFS&REQUEST=GetFeature&outputFormat=application%2Fjson&TYPENAME=public%3Aactivefires_current&cql_filter=hectares > 200';

const res = await fetch(ACTIVE_URL);

const { features } = await res.json();

const active = features
  .filter(d => !['nrcc', 'nwcc', 'ak'].includes(d.properties.agency))
  .sort((a, b) => b.properties.hectares - a.properties.hectares)
  .map(d => ({
    coordinates: [d.properties.lon, d.properties.lat],
    name: d.properties.firename,
    startDate: d.properties.startdate
  }));

writeFileSync('src/data/active.json', JSON.stringify(active));
