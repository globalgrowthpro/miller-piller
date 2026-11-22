import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(rootDir, '.output');

console.log('🚀 Building Miller Piller for production (Node.js Server: cPanel, hPanel, IIS)...');

// Enforce node-server preset so Nitro outputs a standalone Node.js server instead of Cloudflare
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

console.log('📦 Creating hosting compatibility files for cPanel, hPanel, and IIS...');

// 1. server.cjs - CommonJS wrapper for cPanel Phusion Passenger and IIS iisnode
const serverCjs = `// Entry point for cPanel (Setup Node.js App) and Windows IIS (iisnode)
const path = require('path');
const serverEntry = path.resolve(__dirname, './server/index.mjs');

import(serverEntry).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
`;

fs.writeFileSync(path.join(outputDir, 'server.cjs'), serverCjs);
fs.writeFileSync(path.join(rootDir, 'server.cjs'), serverCjs);

// 2. .htaccess for cPanel & Hostinger hPanel (Apache / LiteSpeed)
const htaccess = `# Apache & LiteSpeed Configuration (cPanel / Hostinger hPanel)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve static files from public directory directly if requested
  RewriteCond %{DOCUMENT_ROOT}/public%{REQUEST_URI} -f
  RewriteRule ^(.*)$ public/$1 [L]

  # If actual file exists, serve it directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
</IfModule>

# MIME Types & Caching
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  <FilesMatch "\\.(css|js|png|jpg|jpeg|webp|svg|woff|woff2)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
`;

fs.writeFileSync(path.join(outputDir, '.htaccess'), htaccess);
fs.writeFileSync(path.join(rootDir, '.htaccess'), htaccess);

// 3. web.config for Windows IIS (iisnode)
const webConfig = `<?xml version="1.0" encoding="utf-8"?>
<!-- Windows Server IIS Configuration -->
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.cjs" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <!-- Static files rewrite -->
        <rule name="StaticContent" stopProcessing="true">
          <match url="^(public/|assets/|favicon\\.png|robots\\.txt|.*\\.(png|jpg|jpeg|gif|svg|css|js|webp|woff|woff2|ttf|eot))$" />
          <action type="None"/>
        </rule>
        <!-- Map all dynamic requests to server.cjs -->
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

fs.writeFileSync(path.join(outputDir, 'web.config'), webConfig);
fs.writeFileSync(path.join(rootDir, 'web.config'), webConfig);

console.log('✅ Build completed successfully!');
console.log('📁 Deployment files generated in .output/ :');
console.log('   - .output/server/index.mjs (Standalone Node.js Server)');
console.log('   - .output/public/ (Static Assets & Client Build)');
console.log('   - .output/server.cjs (cPanel / IIS Entry Point)');
console.log('   - .output/.htaccess (cPanel / hPanel Apache & LiteSpeed config)');
console.log('   - .output/web.config (Windows Server IIS config)');
