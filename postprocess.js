const { readFileSync, readdirSync, writeFileSync } = require('fs');
const path = require('path');

const files = readdirSync('data');

const data = files
  .map(file => path.join('data', file))
  .map(file => readFileSync(file))
  .map(file => JSON.parse(file.toString()))
  .map(({ features }) => features)
  .reduce((arr, d) => [...arr, ...d])
  .map(
    ({
      properties: {
        firename: name,
        startdate: start,
        hectares,
        lat,
        lon,
        stage_of_control: control
      }
    }) => ({
      name,
      start,
      hectares,
      coordinates: [lat, lon],
      hectares,
      control
    })
  );

writeFileSync('src/data/fires.json', JSON.stringify(data));
