# E-Katalog Apotek SUKMASARI 2 - Static Website

Website E-Katalog Apotek SUKMASARI 2 ini dirancang sepenuhnya sebagai **Website Statis (Static Website)** yang kompatibel dan siap diunggah langsung ke **GitHub Pages** tanpa perlu konfigurasi tambahan.

## Keunggulan Versi Statis:
- **Serverless**: Tidak menggunakan backend server/database eksternal. Semua data obat (794 produk) dibaca langsung secara lokal.
- **Ringan & Cepat**: Menggunakan HTML, CSS, dan Vanilla JavaScript murni yang dimuat secara instan di perangkat apa pun.
- **Kompatibel Penuh**: Seluruh aset gambar (`Logo.png`, `2.png`), stylesheet (`style.css`), dan script (`app.js`, `products_data.js`) menggunakan **Relative Path** sehingga tidak akan merusak link saat dihosting di sub-direktori GitHub.
- **Single Page Application (SPA)**: Navigasi cepat menggunakan smooth scrolling dan hash-routing tanpa perpindahan halaman eksternal.

---

## Cara Unggah ke GitHub Pages (Panduan Singkat)

Ikuti 5 langkah mudah berikut untuk online-kan katalog apotek Anda:

1. **Buat Repository Baru di GitHub**:
   - Masuk ke akun [GitHub](https://github.com/) Anda.
   - Buat repository baru, misalnya beri nama `katalog-sukmasari2`.
   - Atur repository menjadi **Public**.

2. **Upload File Proyek**:
   - Unggah **6 file utama** berikut ke dalam repository tersebut (pastikan diletakkan di root folder/bukan di dalam sub-folder lain):
     - `index.html`
     - `style.css`
     - `app.js`
     - `products_data.js`
     - `Logo.png`
     - `2.png`

3. **Aktifkan GitHub Pages**:
   - Di halaman repository GitHub Anda, masuk ke menu **Settings** (ikon gerigi).
   - Di kolom sebelah kiri, pilih tab **Pages** (di bawah menu *Code and automation*).

4. **Konfigurasi Build & Deployment**:
   - Di bagian *Build and deployment* -> *Source*, pastikan terpilih **Deploy from a branch**.
   - Di bagian *Branch*, ubah pilihan dari *None* menjadi **main** (atau **master**), pilih folder **/(root)**, lalu klik tombol **Save**.

5. **Selesai & Cek Website**:
   - Tunggu sekitar 1-2 menit agar GitHub memproses deployment Anda.
   - Segarkan (refresh) halaman Settings Pages Anda. GitHub akan menampilkan link website Anda di bagian atas, misalnya:
     `https://username.github.io/katalog-sukmasari2/`
   - Klik link tersebut dan website E-Katalog Apotek Sukmasari 2 Anda telah online dan siap diakses publik!
