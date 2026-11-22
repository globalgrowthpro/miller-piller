# Miller Piller — Deployment Guide (cPanel, Hostinger hPanel, Windows IIS)

This guide explains how to build and deploy the application to **cPanel**, **Hostinger hPanel**, and **Windows Server (IIS)**.

---

## 1. Quick Build

Run the automated production build command:

```powershell
npm run build:server
```

This compiles the full project into the `.output/` folder and automatically generates:
- `.output/server/index.mjs` — Standalone production Node.js server.
- `.output/public/` — Optimized static assets (CSS, JS, images, logos, fonts).
- `.output/server.cjs` — Entry point wrapper for cPanel Phusion Passenger and IIS iisnode.
- `.output/.htaccess` — Apache / LiteSpeed rewrite and security rules for cPanel & hPanel.
- `.output/web.config` — Windows IIS rewrite and iisnode handler rules.

---

## 2. Deploying on cPanel (Apache / LiteSpeed)

### Option A: Using cPanel "Setup Node.js App" (Recommended)
1. Run `npm run build:server` locally.
2. In cPanel, navigate to **Software** &rarr; **Setup Node.js App**.
3. Click **Create Application**:
   - **Node.js version:** Select `20.x` or `22.x`.
   - **Application mode:** `Production`.
   - **Application root:** `miller-piller` (or your chosen folder).
   - **Application URL:** Your domain or subdomain.
   - **Application startup file:** `server.cjs` (or `server/index.mjs`).
4. Upload the contents of `.output/` to the application root directory on your server.
5. In the cPanel Node.js App interface, add your Environment Variables under **Environment variables**:
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable key
   - `PORT` = `3000` (or assigned port)
6. Click **Restart** in the Node.js application interface.

---

## 3. Deploying on Hostinger (hPanel)

### Option A: Using Hostinger Node.js Web App
1. Build locally:
   ```powershell
   npm run build:server
   ```
2. In Hostinger hPanel, go to **Websites** &rarr; **Manage** &rarr; **Node.js**.
3. Set:
   - **Node.js version:** `20.x` or `22.x`.
   - **App directory:** your project directory.
   - **App startup file:** `server.cjs`.
4. Upload `.output/` files to your site directory using FTP or the hPanel File Manager.
5. In hPanel, add your environment variables (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `PORT`).
6. Click **Restart application**.

---

## 4. Deploying on Windows Server (IIS)

### Requirements:
- IIS with **URL Rewrite Module** installed.
- **iisnode** (or `HttpPlatformHandler`) installed on Windows Server.
- Node.js (v20+ or v22+) installed on the server.

### Deployment Steps:
1. Build the project locally:
   ```powershell
   npm run build:server
   ```
2. Copy the contents of `.output/` into your IIS website root (e.g. `C:\inetpub\wwwroot\miller-piller`).
3. Verify that `web.config` and `server.cjs` exist in the root of the site.
4. Set the environment variables in your server's system environment or inside `web.config`:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `PORT`
5. Ensure the IIS Application Pool identity has read & execute permissions on the folder.
6. Browse your website in IIS!
