# OneID Indonesia

OneID Indonesia adalah landing page bilingual (Bahasa Indonesia dan English) yang memperkenalkan konsep ekosistem identitas digital. Website ini menyajikan informasi, manfaat, dan visi OneID. Konten website juga dapat dikelola melalui CMS admin lokal.

## Teknologi

- Next.js 16 dengan App Router
- React 19 dan TypeScript
- Tailwind CSS 4
- Framer Motion untuk animasi
- Lucide React untuk ikon

## Persyaratan

- Node.js 20.9 atau versi lebih baru
- npm

## Instalasi dan menjalankan project

1. Buka folder project di terminal.
2. Pasang dependencies:

   ```bash
   npm install
   ```

3. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Perintah yang tersedia

```bash
npm run dev       # Menjalankan server pengembangan
npm run build     # Membuat production build
npm run start     # Menjalankan production build
npm run lint      # Memeriksa kode dengan ESLint
npm run typecheck # Memeriksa tipe TypeScript
```

Untuk melihat website dalam mode production secara lokal, jalankan `npm run build`, lalu `npm run start`.

## CMS Admin (opsional)

CMS digunakan untuk mengubah konten Bahasa Indonesia dan English, metadata SEO, tautan CTA, serta gambar. CMS juga mendukung penyimpanan draft, preview, dan publish.

1. Buat file `.env.local` di folder utama project.
2. Isi file tersebut dengan dua variabel berikut. Ganti nilainya dengan kata sandi dan secret acak milik sendiri:

   ```dotenv
   ADMIN_PASSWORD=kata-sandi-admin-anda
   ADMIN_SESSION_SECRET=secret-acak-untuk-session
   ```

   Untuk membuat session secret acak, jalankan `openssl rand -base64 32` di terminal, lalu salin hasilnya ke `ADMIN_SESSION_SECRET`.

3. Jalankan server pengembangan (`npm run dev`) dan buka [http://localhost:3000/admin](http://localhost:3000/admin).

Konten tersimpan di `data/site-content.json`, sedangkan gambar yang diunggah disimpan di `public/uploads/`. Penyimpanan ini menggunakan filesystem lokal yang persisten, sehingga CMS ditujukan untuk server Node.js dengan filesystem persisten.

## Catatan

Project ini merupakan presentasi konsep. Integrasi backend identitas, verifikasi identitas, dan penerbitan kredensial belum tersedia. Kredit dan lisensi foto dicantumkan di footer website dan di `public/images/credits.json`.
