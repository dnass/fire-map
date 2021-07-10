import * as path from 'https://deno.land/std/path/mod.ts';

const files = [...Deno.readDirSync('data')].map(({ name }) => name);

const data = files
  .map(file => path.join('data', file))
  .map(file => Deno.readTextFileSync(file))
  .map(JSON.parse)
  .map(({ features }) => features)
  .reduce(
    (arr, fires, i) => [
      ...arr,
      {
        date: files[i].replace('fires-', '').replace('.json', ''),
        fires: fires.map(
          ({
            properties: {
              firename: name,
              startdate: start,
              hectares: area,
              lat,
              lon,
              stage_of_control: control
            }
          }) => ({
            name,
            start,
            coordinates: [lat, lon],
            area,
            control
          })
        )
      }
    ],
    []
  );

Deno.writeTextFileSync('src/data/fires.json', JSON.stringify(data));
