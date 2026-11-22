import { execSync, spawn } from 'child_process';
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

// Also copy public assets directly to dist root
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
fs.writeFileSync(path.join(distDir, 'index.js'), `import('./server/index.mjs');\n`);

// 4. Generate static index.html and route pages
console.log('📄 Generating static index.html and pre-rendered pages...');
const PRERENDER_PORT = '4055';
const serverProc = spawn(process.execPath, [path.join(distDir, 'server.cjs')], {
  env: { ...process.env, PORT: PRERENDER_PORT },
  stdio: 'ignore',
});

// Wait for server to start and fetch routes
async function prerender() {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const routes = [
    { path: '/', file: 'index.html' },
    { path: '/about', file: 'about/index.html' },
    { path: '/services', file: 'services/index.html' },
    { path: '/equipment', file: 'equipment/index.html' },
    { path: '/sectors', file: 'sectors/index.html' },
    { path: '/projects', file: 'projects/index.html' },
    { path: '/quote', file: 'quote/index.html' },
    { path: '/contact', file: 'contact/index.html' },
    { path: '/not-found', file: '404.html' },
  ];

  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:${PRERENDER_PORT}${r.path}`);
      if (res.ok || res.status === 404) {
        const html = await res.text();
        const targetPath = path.join(distDir, r.file);
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, html, 'utf8');
        console.log(`   ✓ Rendered: ${r.file}`);
      }
    } catch (e) {
      console.warn(`   ⚠ Could not pre-render ${r.path}:`, e.message);
    }
  }

  serverProc.kill();
}

await prerender();

// 5. .htaccess for cPanel & Hostinger hPanel (Apache / LiteSpeed)
const htaccess = `# Apache & LiteSpeed Configuration (cPanel / Hostinger hPanel)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve existing file or directory directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # SPA Fallback: route all non-file requests to index.html
  RewriteRule ^ index.html [L]
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
fs.writeFileSync(path.join(rootDir, '.htaccess'), htaccess);

// 6. web.config for Windows Server IIS
const webConfig = `<?xml version="1.0" encoding="utf-8"?>
<!-- Windows Server IIS Configuration -->
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Static files: serve directly -->
        <rule name="StaticContent" stopProcessing="true">
          <match url="^(assets/|public/|favicon\\.png|robots\\.txt|.*\\.(png|jpg|jpeg|gif|svg|css|js|webp|woff|woff2|ttf|eot))$" />
          <action type="None"/>
        </rule>
        <!-- SPA Fallback: route everything to index.html -->
        <rule name="SPAFallback" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <remove fileExtension=".webp" />
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
`;
fs.writeFileSync(path.join(distDir, 'web.config'), webConfig);
fs.writeFileSync(path.join(rootDir, 'web.config'), webConfig);

// 7. Minimal production package.json inside dist
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
console.log('   ├── dist/index.html      (Main static HTML document)');
console.log('   ├── dist/404.html        (Fallback 404 page)');
console.log('   ├── dist/about/          (Pre-rendered /about)');
console.log('   ├── dist/services/       (Pre-rendered /services)');
console.log('   ├── dist/equipment/      (Pre-rendered /equipment)');
console.log('   ├── dist/sectors/        (Pre-rendered /sectors)');
console.log('   ├── dist/projects/       (Pre-rendered /projects)');
console.log('   ├── dist/quote/          (Pre-rendered /quote)');
console.log('   ├── dist/contact/        (Pre-rendered /contact)');
console.log('   ├── dist/assets/         (Compiled CSS, JS, Images, Logo)');
console.log('   ├── dist/.htaccess       (Apache/LiteSpeed for cPanel & hPanel)');
console.log('   ├── dist/web.config      (Windows IIS config)');
console.log('   ├── dist/server.cjs      (Optional Node.js server entry)');
console.log('   └── dist/package.json    (Production start config)');
