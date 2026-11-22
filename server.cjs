// Entry point for cPanel (Setup Node.js App) and Windows IIS (iisnode)
const path = require('path');
const serverEntry = path.resolve(__dirname, './server/index.mjs');

import(serverEntry).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
