# pantauenergi

Aplikasi monitoring energi listrik (Beta).
Menggunakan Node.js sebagai REST API Server, Vue.js sebagai Web Client, dan MySQL sebagai databasenya.

# Menjalankan project

Untuk dapat menjalankan project ini, pastikan Node.js dan MySQL telah terinstall di mesin anda.

## Install dependencies

Untuk menginstall dependencies, masuk ke direktori project dan jalankan command berikut:

`npm install`

Jika terdapat error jalankan command berikut:

`npm audit fix` atau `npm audit fix --force`

## Konfigurasi database dan API

Pertama untuk konfigurasi database, buka file `/config/db.js` dan edit variable sesuai dengan database server anda.

Kedua untuk konfigurasi API, buka file `views/app.js` pada bagian atas sendiri terdapat url API server yang digunakan, sesuaikan dengan host dan port yang dijalankan server.

Untuk membuat database untuk pertama kalinya, jalankan command `node scripts/createdb.js`.

## Menjalankan server:

`npm start`

## Penggunaan API

`http://localhost:3000/api/data/log?awal=..&akhir=..&spot=..&tampil=..` (GET)

    Parameter request:
    awal    : tanggal awal periode pengambilan data (ex: '2018-01-01 00:00:01')
    akhir   : tanggal akhir periode pengambilan data (ex: '2018-12-31 23:59:59')
    spot    : spot yang akan ditampilkan (ex: 'Sensor 1')
    tampil  : penampilan data per ('hari', 'minggu', 'bulan', 'tahun')

`http://localhost:3000/api/data` (POST)

    Parameter body:
    tegangan    : float
    arus        : float
    daya        : float
    spot        : string