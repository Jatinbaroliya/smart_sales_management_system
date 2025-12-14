import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const p1 = path.resolve('./dist/server.js');
const p2 = path.resolve('./dist/src/server.js');

function die(msg) {
  console.error(msg);
  process.exit(1);
}

let target = null;
if (fs.existsSync(p1)) target = p1;
else if (fs.existsSync(p2)) target = p2;
else die(`Cannot find built server. Looked for:\n  ${p1}\n  ${p2}`);

const fileUrl = pathToFileURL(target).href;
import(fileUrl).catch((err) => {
  console.error('Failed to import built server:', err);
  process.exit(1);
});
