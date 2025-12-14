const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const candidates = [
  path.resolve(__dirname, 'dist', 'src', 'server.js'),
  path.resolve(__dirname, 'dist', 'server.js'),
  path.resolve(__dirname, 'dist', 'api', 'index.js'),
  path.resolve(__dirname, 'dist', 'index.js'),
  path.resolve(__dirname, 'dist', 'src', 'index.js'),
];

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
}

(async () => {
  const found = candidates.find(exists);
  if (!found) {
    console.error('No built entry found. Looked for:\n' + candidates.join('\n'));
    process.exit(1);
  }

  // Try loading as CommonJS first
  try {
    require(found);
    return;
  } catch (err) {
    // If it's an ESM file, Node will throw ERR_REQUIRE_ESM
    if (err && err.code === 'ERR_REQUIRE_ESM') {
      const url = pathToFileURL(found).href;
      import(url).catch(e => {
        console.error('Failed to import ESM built file:', e);
        process.exit(1);
      });
      return;
    }

    // If some other error occurred, still attempt dynamic import as fallback
    const url = pathToFileURL(found).href;
    import(url).catch(e => {
      console.error('Failed to load built file:', e);
      process.exit(1);
    });
  }
})();
