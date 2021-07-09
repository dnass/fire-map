import {
  readJSON,
  writeJSON,
  removeFile
} from 'https://deno.land/x/flat@0.0.10/mod.ts';

const filename = Deno.args[0];
const json = await readJSON(filename);
console.log(json);

await writeJSON('data/fires-processed.json', json);
console.log('Wrote a post process file');
