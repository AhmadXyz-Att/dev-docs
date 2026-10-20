© AhmadXyz 2026

Bahan yang perlu di-install:

- Node.js - runtime JavaScript
- npm - package manager Node.js
- Google Chrome - browser untuk Puppeteer
- Xvfb - virtual display untuk VPS Linux 
- puppeteer-real-browser - automasi browser

Install Module

npm install puppeteer-real-browser

Install Chrome (Ubuntu/Debian AMD64)

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb

Install Xvfb

sudo apt update
sudo apt install -y xvfb xauth

Menjalankan Script

xvfb-run --auto-servernum --server-args="-screen 0 1920x1080x24" node namafile.js

Note: Tidak kompatibel langsung dengan konfigurasi default Vercel. Disarankan menggunakan VPS Linux.