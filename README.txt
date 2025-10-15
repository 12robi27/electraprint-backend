# ElectraPrint_Backend (Bahasa Indonesia)

Backend Node.js untuk Electra Print — siap upload ke **Render**.

## Fitur
- Upload **satu** atau **banyak** file (`/upload`, `/upload-multiple`)
- Daftar file (`GET /files`) beserta ukuran
- Hapus file (`DELETE /files/:name`)
- Static serve folder `/uploads`
- Endpoint **health check** (`/healthz`) untuk Render
- Port dinamis: `process.env.PORT || 3000`

## Cara Menjalankan (Lokal)
```bash
npm install
npm start
# buka http://localhost:3000/healthz  -> OK
```

## Deploy ke Render (tanpa Git)
1. Buka https://dashboard.render.com/web/new → **Web Service**
2. Source: **Manual → Upload code (ZIP)** → unggah file **ElectraPrint_Backend.zip**
3. Environment: **Node**
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Health Check Path: `/healthz`
7. Create Web Service → tunggu URL aktif, misal: `https://electraprint-backend.onrender.com`

## Endpoint Ringkas
- `POST /upload`           → field form `file`
- `POST /upload-multiple`  → field form `files` (bisa banyak)
- `GET  /files`            → list file (nama & size)
- `DELETE /files/:name`    → hapus file
- `GET  /healthz`          → "OK"

## Catatan
- Folder `uploads/` dibuat otomatis saat server jalan.
- Di frontend, set:
  ```js
  const backendURL = "https://ALAMAT-BACKEND-RENDER-KAMU";
  ```

— Dibuat otomatis: 2025-10-15T13:02:04.435665