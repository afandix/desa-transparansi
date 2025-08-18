# Desa Transparansi

Portal transparansi desa: halaman publik + panel admin (CRUD anggaran & proyek).

## 🔗 Link Produksi

- Web: <https://desa-transparansi.web.app/>
- Admin: <https://desa-transparansi.web.app/login.html>

## ✨ Fitur

- Login (Firebase Auth)
- CRUD **Anggaran** & **Proyek** (Firestore)
- Halaman publik **index.html** menampilkan data terbaru

## 🧰 Teknologi

Firebase Hosting + Auth + Firestore (Web)

## 🏃 Menjalankan Lokal

1. Install deps (opsional bila tanpa bundler).
2. Login Firebase & pilih project:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use <PROJECT_ID>
   ```
