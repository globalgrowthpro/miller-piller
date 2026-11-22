import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(rootDir, '.output');
const distDir = path.resolve(rootDir, 'dist');

console.log('🚀 Building Miller Piller into a single "dist" directory...');

// 1. Run Nitro build with node-server preset
process.env.NITRO_PRESET = 'node-server';

try {
  execSync('npx vite build', {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, NITRO_PRESET: 'node-server' },
  });
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}

// 2. Prepare single dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy server and public from .output to dist
console.log('📦 Assembling standalone dist package...');
fs.cpSync(path.join(outputDir, 'server'), path.join(distDir, 'server'), { recursive: true });
fs.cpSync(path.join(outputDir, 'public'), path.join(distDir, 'public'), { recursive: true });

// Also copy assets and static files directly to dist root for direct document root compatibility
fs.cpSync(path.join(outputDir, 'public'), distDir, { recursive: true });

// 3. server.cjs - CommonJS entry point for cPanel Phusion Passenger and IIS iisnode
const serverCjs = `// Entry point for cPanel (Setup Node.js App) and Windows IIS (iisnode)
const path = require('path');
const { pathToFileURL } = require('url');

const serverFile = path.resolve(__dirname, './server/index.mjs');
const serverUrl = pathToFileURL(serverFile).href;

import(serverUrl).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
`;
fs.writeFileSync(path.join(distDir, 'server.cjs'), serverCjs);
fs.writeFileSync(path.join(distDir, 'index.cjs'), serverCjs);
fs.writeFileSync(path.join(distDir, 'index.js'), `import('./server/index.mjs');\\n`);

// 4. .htaccess for cPanel & Hostinger hPanel (Apache / LiteSpeed)
const htaccess = `# Apache & LiteSpeed Configuration (cPanel / Hostinger hPanel)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve existing files directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Check in public folder if request didn't match root
  RewriteCond %{DOCUMENT_ROOT}/public%{REQUEST_URI} -f
  RewriteRule ^(.*)$ public/$1 [L]
</IfModule>

# Caching & Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  <FilesMatch "\\.(css|js|png|jpg|jpeg|webp|svg|woff|woff2|ico)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
</IfModule>

# Gzip / Brotli Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
`;
fs.writeFileSync(path.join(distDir, '.htaccess'), htaccess);

// 5. web.config for Windows Server IIS
const webConfig = `<?xml version="1.0" encoding="utf-8"?>
<!-- Windows Server IIS Configuration -->
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.cjs" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <!-- Static files: serve directly -->
        <rule name="StaticContent" stopProcessing="true">
          <match url="^(assets/|public/|favicon\\.png|robots\\.txt|.*\\.(png|jpg|jpeg|gif|svg|css|js|webp|woff|woff2|ttf|eot))$" />
          <action type="None"/>
        </rule>
        <!-- Dynamic requests: route to server.cjs -->
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.cjs"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
    <iisnode
      watchedFiles="server.cjs;server\\index.mjs"
      loggingEnabled="true"
      logDirectory="iisnode"
    />
  </system.webServer>
</configuration>
`;
fs.writeFileSync(path.join(distDir, 'web.config'), webConfig);

// 6. Minimal production package.json inside dist
const prodPackageJson = {
  name: "miller-piller",
  version: "1.0.0",
  private: true,
  type: "module",
  main: "server.cjs",
  scripts: {
    start: "node server.cjs"
  }
};
fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(prodPackageJson, null, 2)
);

console.log('\n✨ Single "dist" folder created successfully at: ' + distDir);
console.log('📂 Everything is ready in "dist/":');
console.log('   ├── dist/server/         (Node.js server bundle)');
console.log('   ├── dist/assets/         (Compiled CSS, JS, Images)');
console.log('   ├── dist/public/         (Static assets)');
console.log('   ├── dist/server.cjs      (Entry point for cPanel & IIS)');
console.log('   ├── dist/index.js        (Entry point)');
console.log('   ├── dist/.htaccess       (Apache/LiteSpeed for cPanel & hPanel)');
console.log('   ├── dist/web.config      (Windows IIS config)');
console.log('   └── dist/package.json    (Production start config)');
