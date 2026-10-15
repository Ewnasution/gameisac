'use strict';
/* =========================================================
   NEON ACADEMY — script.js
   1. Konfigurasi   2. Bank soal   3. State   4. Utilitas
   5. Navigasi      6. Soal        7. Timer   8. Jawaban & skor
   9. Hasil        10. Init
   ========================================================= */

/* ---------- 1. KONFIGURASI ---------- */
const JUMLAH_SOAL = 10;
const JUMLAH_LEVEL = 10;
const WAKTU_MS = 10000;
const POIN_BENAR = 5;
const POIN_SALAH = -2;
const POIN_WAKTU_HABIS = -2;

const MAPEL = [
  { id: 'matematika',   nama: 'Matematika',    ikon: '∑', desk: 'Taklukkan angka, bangun datar, dan logika.' },
  { id: 'fisika',       nama: 'Fisika',        ikon: '⚛', desk: 'Jelajahi alam, tubuh, dan alam semesta.' },
  { id: 'kimia',        nama: 'Kimia',          ikon: '⚛', desk: 'Jelajahi alam, tubuh, dan alam semesta.' },
  { id: 'biologi',      nama: 'Biologi',       ikon: '⚛', desk: 'Jelajahi alam, tubuh, dan alam semesta.' },
  { id: 'sejarahIslam', nama: 'Sejarah Islam', ikon: '☪', desk: 'Telusuri kisah Nabi, sahabat, dan peradaban.' },
  { id: 'fiqh',         nama: 'Fiqh',          ikon: '⚖', desk: 'Pelajari tata cara ibadah dan hukumnya.' },
  { id: 'tauhid',       nama: 'Tauhid',        ikon: '✦', desk: 'Kenali keesaan Allah dan pokok keimanan.' },
];

/* ---------- 2. BANK SOAL (BAGIAN YANG BOLEH DIEDIT) ----------
   CARA MENGGANTI SOAL DUMMY:
   - Setiap soal ditulis dengan: soal("Pertanyaan", [A, B, C, D], indeksBenar, "Penjelasan", "kesulitan")
   - options: tepat 4 teks jawaban (harus berbeda satu sama lain).
   - indeksBenar: 0 = pilihan pertama, 1 = kedua, 2 = ketiga, 3 = keempat (urutan SEBELUM diacak).
   - difficulty ("mudah" | "sedang" | "sulit") opsional; belum dipakai, disiapkan untuk pengembangan level.
   - id dibuat otomatis (mis. "ipa-03"). Boleh juga diisi manual lewat properti id.
   - Minimal 10 soal per mata pelajaran; disarankan 20 atau lebih.
   ---------------------------------------------------------- */
const soal = (question, options, correctAnswer, explanation, difficulty = 'mudah') =>
  ({ id: '', question, options, correctAnswer, explanation, difficulty });

const BANK_SOAL = {
  matematika: [
    soal('Berapakah hasil dari 2 + 3?', ['4', '5', '6', '7'], 1, '2 + 3 = 5.'),
    soal('Berapakah hasil dari 9 × 7?', ['56', '63', '72', '54'], 1, '9 × 7 = 63.'),
    soal('Berapakah hasil dari 100 − 37?', ['63', '67', '73', '57'], 0, '100 − 37 = 63.'),
    soal('Akar kuadrat dari 81 adalah?', ['7', '8', '9', '11'], 2, '9 × 9 = 81.'),
    soal('Berapakah hasil dari 48 ÷ 6?', ['6', '7', '8', '9'], 2, '6 × 8 = 48.'),
    soal('Keliling persegi dengan sisi 5 cm adalah … cm.', ['10', '15', '20', '25'], 2, 'Keliling = 4 × 5 = 20 cm.'),
    soal('Luas persegi panjang berukuran 8 cm × 3 cm adalah … cm².', ['11', '22', '24', '32'], 2, 'Luas = 8 × 3 = 24 cm².'),
    soal('Berapakah 25% dari 80?', ['10', '20', '25', '40'], 1, '25% = 1/4, sehingga 80 ÷ 4 = 20.'),
    soal('Manakah bilangan prima berikut?', ['9', '15', '21', '13'], 3, '13 hanya habis dibagi 1 dan 13.'),
    soal('Berapakah hasil dari 3² + 4²?', ['12', '25', '49', '7'], 1, '9 + 16 = 25.'),
    soal('Sudut siku-siku besarnya … derajat.', ['45', '90', '180', '360'], 1, 'Sudut siku-siku = 90°.'),
    soal('Berapakah hasil dari 1/2 + 1/4?', ['2/6', '3/4', '1/6', '1/3'], 1, '2/4 + 1/4 = 3/4.'),
    // ALJABAR
    soal('Sederhanakan 3x + 5x - 2x.', ['6x', '4x', '8x', '10x'], 0, 'Gabungkan suku sejenis: (3 + 5 - 2)x = 6x.'),
    soal('Berapakah hasil dari (2a²)(3a³)?', ['5a⁵', '6a⁶', '5a⁶', '6a⁵'], 3, 'Kalikan koefisien 2 × 3 = 6 dan jumlahkan pangkat a: 2 + 3 = 5.'),
    soal('Faktorkan x² + 7x + 12.', ['(x + 2)(x + 6)', '(x - 3)(x - 4)', '(x + 3)(x + 4)', '(x + 1)(x + 12)'], 2, 'Cari dua bilangan yang jumlahnya 7 dan hasil kalinya 12, yaitu 3 dan 4.'),
    soal('Faktorkan 4x² - 25.', ['(4x - 5)(x + 5)', '(2x - 5)(2x + 5)', '(2x - 5)²', '(2x + 5)²'], 1, 'Gunakan selisih kuadrat: (2x)² - 5² = (2x - 5)(2x + 5).'),
    soal('Sederhanakan (x² - 9)/(x - 3), dengan x ≠ 3.', ['x + 3', 'x - 3', 'x² + 3', 'x + 9'], 0, 'Karena x² - 9 = (x - 3)(x + 3), faktor x - 3 dapat dicoret.'),
    soal('Jika a = 2 dan b = -3, nilai 2a² - 3b adalah ....', ['-1', '8', '11', '17'], 3, '2(2²) - 3(-3) = 8 + 9 = 17.'),
    soal('Nilai 2x² - 3x + 1 untuk x = -2 adalah ....', ['3', '9', '15', '11'], 2, '2(-2)² - 3(-2) + 1 = 8 + 6 + 1 = 15.'),
    soal('Hasil perkalian (x + 2)(x - 5) adalah ....', ['x² + 3x - 10', 'x² - 3x - 10', 'x² - 7x + 10', 'x² - 10'], 1, 'Kalikan setiap suku: x² - 5x + 2x - 10 = x² - 3x - 10.'),
    soal('Faktorkan 6x² + 9x.', ['3x(2x + 3)', '3(2x² + 3)', 'x(6x + 9x)', '6x(x + 3)'], 0, 'Faktor persekutuan terbesar dari 6x² dan 9x adalah 3x.'),
    soal('Sederhanakan 5x - [2x - (3x - 4)].', ['4x + 4', '6x + 4', '-x - 4', '6x - 4'], 3, 'Bagian dalam kurung menjadi 2x - 3x + 4 = -x + 4; maka 5x - (-x + 4) = 6x - 4.'),
    soal('Sederhanakan (12x³y²)/(3xy), dengan x dan y tidak nol.', ['4x³y', '9x²y', '4x²y', '4x²y²'], 2, 'Bagi koefisien 12/3 = 4 dan kurangi pangkat: x³/x = x² serta y²/y = y.'),
    soal('Bentuk sederhana dari (2x - 3)² adalah ....', ['4x² - 9', '4x² - 12x + 9', '4x² - 6x + 9', '2x² - 12x + 9'], 1, 'Gunakan (a - b)² = a² - 2ab + b².'),
    soal('Penyelesaian persamaan x² - 5x = 0 adalah ....', ['x = 0 atau x = 5', 'x = -5 atau x = 0', 'x = 1 atau x = 5', 'x = 0 saja'], 0, 'Faktorkan x² - 5x = x(x - 5) = 0, sehingga x = 0 atau x = 5.'),
    soal('Sederhanakan (x³ - 8)/(x - 2), dengan x ≠ 2.', ['x² - 2x + 4', 'x² + 4', 'x² - 4x + 4', 'x² + 2x + 4'], 3, 'Gunakan x³ - 2³ = (x - 2)(x² + 2x + 4).'),
    soal('Nilai (a + b)² - (a - b)² adalah ....', ['2ab', 'a² + b²', '4ab', '4a²b²'], 2, 'Ekspansi kedua kuadrat menghasilkan selisih 4ab.'),
    soal('Sederhanakan 2/x + 3/x, dengan x ≠ 0.', ['5/(2x)', '5/x', '6/x', '5/(x²)'], 1, 'Penyebut sama, sehingga pembilangnya dijumlahkan: (2 + 3)/x = 5/x.'),
    soal('Sederhanakan 3x(2x - 4) + 2(x + 5).', ['6x² - 10x + 10', '6x² - 14x + 10', '6x² - 10x - 10', '5x² - 10x + 10'], 0, 'Hasil ekspansi: 6x² - 12x + 2x + 10 = 6x² - 10x + 10.'),
    soal('Faktorkan x² - 2x - 15.', ['(x - 3)(x + 5)', '(x - 5)(x - 3)', '(x + 5)(x - 3)', '(x - 5)(x + 3)'], 3, 'Dua bilangan yang hasil kalinya -15 dan jumlahnya -2 adalah -5 dan 3.'),
    soal('Jika x + y = 10 dan xy = 21, nilai x² + y² adalah ....', ['79', '42', '58', '100'], 2, 'x² + y² = (x + y)² - 2xy = 10² - 2(21) = 58.'),
    soal('Sederhanakan (a³/b²) ÷ (1/(ab)), dengan a dan b tidak nol.', ['a²/b³', 'a⁴/b', 'a⁴/b³', 'a³b'], 1, 'Membagi dengan 1/(ab) sama dengan mengalikan ab: (a³/b²)(ab) = a⁴/b.'),
    soal('Jika 5^(x + 1) = 125, nilai x adalah ....', ['2', '1', '3', '4'], 0, 'Karena 125 = 5³, maka x + 1 = 3 sehingga x = 2.'),
    soal('Hasil perkalian (x - 2)(x² + 2x + 4) adalah ....', ['x³ + 8', 'x³ - 4x + 8', 'x³ - 2x² - 4', 'x³ - 8'], 3, 'Gunakan identitas selisih kubus: (x - 2)(x² + 2x + 4) = x³ - 2³.'),
    soal('Sederhanakan √50 + √8.', ['13√2', '6√2', '7√2', '3√10'], 2, '√50 = 5√2 dan √8 = 2√2, sehingga jumlahnya 7√2.'),
    soal('Sederhanakan (2x² + 6x)/(2x), dengan x ≠ 0.', ['x + 6', 'x + 3', '2x + 3', 'x² + 3'], 1, 'Bagi setiap suku pembilang dengan 2x: 2x²/(2x) + 6x/(2x) = x + 3.'),
    soal('Jika p + q = 7 dan p - q = 3, nilai p adalah ....', ['5', '2', '3', '7'], 0, 'Jumlahkan kedua persamaan: 2p = 10, sehingga p = 5.'),

    // ARITMATIKA
    soal('Berapakah 18% dari 250?', ['45', '35', '40', '50'], 0, '18% × 250 = 0,18 × 250 = 45.'),
    soal('Perbandingan dua bilangan adalah 3 : 5 dan jumlahnya 64. Bilangan yang lebih kecil adalah ....', ['16', '32', '40', '24'], 3, 'Jumlah bagian = 3 + 5 = 8; tiap bagian 64/8 = 8, sehingga bilangan kecil = 3 × 8 = 24.'),
    soal('Rata-rata dari 72, 80, 76, dan 92 adalah ....', ['78', '82', '80', '84'], 2, 'Jumlah data 320; rata-rata = 320/4 = 80.'),
    soal('Harga suatu barang Rp120.000 naik 15%. Harga setelah kenaikan adalah ....', ['Rp132.000', 'Rp138.000', 'Rp135.000', 'Rp140.000'], 1, 'Kenaikan = 15% × Rp120.000 = Rp18.000; harga baru Rp138.000.'),
    soal('Sebuah barang seharga Rp350.000 mendapat diskon 20%. Harga setelah diskon adalah ....', ['Rp280.000', 'Rp270.000', 'Rp300.000', 'Rp330.000'], 0, 'Diskon = 20% × Rp350.000 = Rp70.000; harga akhir Rp280.000.'),
    soal('Modal Rp2.000.000 mendapat bunga tunggal 6% per tahun selama 3 tahun. Besar bunganya adalah ....', ['Rp120.000', 'Rp300.000', 'Rp420.000', 'Rp360.000'], 3, 'Bunga = modal × suku bunga × waktu = 2.000.000 × 0,06 × 3 = Rp360.000.'),
    soal('Berapakah hasil 2⁵ × 2³?', ['64', '128', '256', '512'], 2, 'Untuk basis sama, pangkat dijumlahkan: 2⁵ × 2³ = 2⁸ = 256.'),
    soal('Nilai √144 + ∛27 adalah ....', ['9', '15', '12', '18'], 1, '√144 = 12 dan ∛27 = 3, sehingga jumlahnya 15.'),
    soal('Hasil 3/4 - 2/5 adalah ....', ['7/20', '1/20', '1/5', '5/9'], 0, 'Samakan penyebut: 15/20 - 8/20 = 7/20.'),
    soal('Hasil (5/6) ÷ (10/9) adalah ....', ['3/5', '5/4', '4/3', '3/4'], 3, '(5/6) × (9/10) = 45/60 = 3/4.'),
    soal('Bentuk pecahan paling sederhana dari 0,125 adalah ....', ['1/4', '1/5', '1/8', '1/10'], 2, '0,125 = 125/1000 = 1/8 setelah disederhanakan.'),
    soal('Berapakah hasil 2,4 × 0,35?', ['0,084', '0,84', '0,74', '8,4'], 1, '24 × 35 = 840; ada tiga angka di belakang koma, sehingga hasilnya 0,840 = 0,84.'),
    soal('Nilai 7!/5! adalah ....', ['42', '35', '49', '210'], 0, '7!/5! = 7 × 6 = 42.'),
    soal('FPB dari 84 dan 126 adalah ....', ['14', '21', '63', '42'], 3, 'Faktor persekutuan terbesar 84 dan 126 adalah 42.'),
    soal('KPK dari 12 dan 18 adalah ....', ['24', '48', '36', '72'], 2, '12 = 2² × 3 dan 18 = 2 × 3², sehingga KPK = 2² × 3² = 36.'),
    soal('Sebuah kendaraan menempuh 150 km dalam 2,5 jam. Kecepatan rata-ratanya adalah ....', ['50 km/jam', '60 km/jam', '65 km/jam', '75 km/jam'], 1, 'Kecepatan = jarak/waktu = 150/2,5 = 60 km/jam.'),
    soal('Sebuah pekerjaan selesai dalam 15 hari oleh 8 pekerja. Jika kemampuan semua pekerja sama, waktu yang diperlukan 12 pekerja adalah ....', ['10 hari', '8 hari', '12 hari', '18 hari'], 0, 'Total pekerjaan 8 × 15 = 120 hari-orang; 120/12 = 10 hari.'),
    soal('Sebanyak 20 liter larutan berkadar 30% mengandung zat terlarut sebanyak ....', ['3 liter', '5 liter', '8 liter', '6 liter'], 3, '30% × 20 liter = 6 liter.'),
    soal('Pada peta berskala 1 : 250.000, jarak dua tempat 4 cm. Jarak sebenarnya adalah ....', ['1 km', '2,5 km', '10 km', '100 km'], 2, 'Jarak sebenarnya = 4 × 250.000 = 1.000.000 cm = 10 km.'),
    soal('Nilai 15 - 3(2 + 1) adalah ....', ['3', '6', '9', '18'], 1, 'Kerjakan kurung terlebih dahulu: 15 - 3 × 3 = 15 - 9 = 6.'),
    soal('Nilai |−17| + |−8| adalah ....', ['25', '9', '−25', '−9'], 0, 'Nilai mutlak −17 adalah 17 dan nilai mutlak −8 adalah 8; jumlahnya 25.'),
    soal('Berapakah hasil 1,2 ÷ 0,04?', ['3', '12', '300', '30'], 3, 'Kalikan kedua bilangan dengan 100: 120 ÷ 4 = 30.'),
    soal('Bentuk desimal dari 35% adalah ....', ['3,5', '0,035', '0,35', '35,0'], 2, 'Persen berarti per seratus: 35% = 35/100 = 0,35.'),
    soal('Perbandingan X : Y = 4 : 7. Jika X = 28, maka Y = ....', ['35', '49', '42', '56'], 1, 'Faktor skala = 28/4 = 7, sehingga Y = 7 × 7 = 49.'),
    soal('Nilai Rp1.000.000 bertambah 10% setiap tahun. Nilai setelah 2 tahun dengan bunga majemuk adalah ....', ['Rp1.210.000', 'Rp1.200.000', 'Rp1.110.000', 'Rp1.220.000'], 0, 'Nilai akhir = 1.000.000 × 1,1² = Rp1.210.000.'),

    // PERSAMAAN DAN PERTIDAKSAMAAN
    soal('Penyelesaian 3x - 7 = 11 adalah ....', ['x = 6', 'x = 4', 'x = 5', 'x = 7'], 0, '3x = 18, sehingga x = 6.'),
    soal('Penyelesaian 5(2x - 1) = 3x + 16 adalah ....', ['x = 2', 'x = 4', 'x = 7', 'x = 3'], 3, '10x - 5 = 3x + 16, jadi 7x = 21 dan x = 3.'),
    soal('Himpunan penyelesaian 2x + 5 < 13 adalah ....', ['x > 4', 'x < 9', 'x < 4', 'x > 9'], 2, '2x < 8, sehingga x < 4.'),
    soal('Penyelesaian x/3 - 2 = 4 adalah ....', ['x = 6', 'x = 18', 'x = 12', 'x = 2'], 1, 'x/3 = 6, sehingga x = 18.'),
    soal('Penyelesaian x² - 9 = 0 adalah ....', ['x = -3 atau x = 3', 'x = 0 atau x = 9', 'x = -9 atau x = 9', 'x = 3 saja'], 0, 'x² = 9, sehingga x = ±3.'),
    soal('Penyelesaian 2x - 3 ≥ 7 adalah ....', ['x ≤ 5', 'x ≥ 2', 'x ≤ 2', 'x ≥ 5'], 3, '2x ≥ 10, sehingga x ≥ 5.'),
    soal('Jika x + y = 9 dan x - y = 3, nilai x adalah ....', ['3', '9', '6', '12'], 2, 'Jumlahkan kedua persamaan: 2x = 12, maka x = 6.'),
    soal('Penyelesaian 4(x - 2) = 2(x + 3) adalah ....', ['x = 3', 'x = 7', 'x = 5', 'x = 10'], 1, '4x - 8 = 2x + 6, sehingga 2x = 14 dan x = 7.'),
    soal('Penyelesaian (x - 1)/2 ≤ 3 adalah ....', ['x ≤ 7', 'x ≥ 7', 'x ≤ 5', 'x ≥ 5'], 0, 'Kalikan kedua ruas dengan 2: x - 1 ≤ 6, sehingga x ≤ 7.'),
    soal('Penyelesaian 3x + 2 = 2x - 5 adalah ....', ['x = 7', 'x = -3', 'x = 3', 'x = -7'], 3, 'Kurangi 2x dari kedua ruas: x + 2 = -5, sehingga x = -7.'),
    soal('Penyelesaian |x - 2| = 5 adalah ....', ['x = -5 atau x = 5', 'x = -3 atau x = 5', 'x = -3 atau x = 7', 'x = 2 atau x = 7'], 2, 'Kasus x - 2 = 5 memberi x = 7; x - 2 = -5 memberi x = -3.'),
    soal('Penyelesaian x² - 6x + 9 = 0 adalah ....', ['x = -3', 'x = 3', 'x = 6', 'x = 9'], 1, 'Persamaan menjadi (x - 3)² = 0, sehingga x = 3.'),
    soal('Himpunan penyelesaian x² - 4x < 0 adalah ....', ['0 < x < 4', 'x < 0 atau x > 4', 'x < 4', 'x > 0'], 0, 'x(x - 4) < 0 bernilai negatif di antara kedua akar, yaitu 0 dan 4.'),
    soal('Penyelesaian 2x + 1 ≤ x + 6 adalah ....', ['x ≥ 5', 'x ≤ 7', 'x ≥ 7', 'x ≤ 5'], 3, 'Kurangi x dan 1 dari kedua ruas: x ≤ 5.'),
    soal('Penyelesaian 7 - 2x = 15 adalah ....', ['x = 4', 'x = -11', 'x = -4', 'x = 11'], 2, '-2x = 8, sehingga x = -4.'),
    soal('Penyelesaian x/4 + x/6 = 5 adalah ....', ['x = 10', 'x = 12', 'x = 15', 'x = 20'], 1, 'KPK penyebut 12: 3x + 2x = 60, jadi 5x = 60 dan x = 12.'),
    soal('Jika 2x + y = 7 dan x - y = 2, nilai x adalah ....', ['3', '1', '2', '4'], 0, 'Jumlahkan persamaan: 3x = 9, sehingga x = 3.'),
    soal('Penyelesaian (x + 1)(x - 4) = 0 adalah ....', ['x = 1 atau x = -4', 'x = -1 saja', 'x = 4 saja', 'x = -1 atau x = 4'], 3, 'Hasil kali nol jika x + 1 = 0 atau x - 4 = 0.'),
    soal('Himpunan penyelesaian 3 ≤ 2x + 1 < 9 adalah ....', ['1 < x ≤ 4', 'x ≤ 1 atau x ≥ 4', '1 ≤ x < 4', '2 ≤ x < 5'], 2, 'Kurangi 1: 2 ≤ 2x < 8; bagi 2 menghasilkan 1 ≤ x < 4.'),
    soal('Penyelesaian 2/(x + 1) = 1 adalah ....', ['x = -1', 'x = 1', 'x = 2', 'x = 3'], 1, '2 = x + 1, sehingga x = 1; nilai x = -1 memang tidak diperbolehkan.'),
    soal('Penyelesaian x² = 5x adalah ....', ['x = 0 atau x = 5', 'x = -5 atau x = 0', 'x = 5 saja', 'x = 1 atau x = 5'], 0, 'x² - 5x = x(x - 5) = 0, sehingga x = 0 atau x = 5.'),
    soal('Himpunan penyelesaian x² + 2x - 8 ≥ 0 adalah ....', ['-4 ≤ x ≤ 2', 'x ≤ -2 atau x ≥ 4', 'x ≥ -4 dan x ≤ 2', 'x ≤ -4 atau x ≥ 2'], 3, 'Faktorkan menjadi (x + 4)(x - 2) ≥ 0; hasilnya di luar interval akar.'),
    soal('Penyelesaian 4 - 3x > 10 adalah ....', ['x > -2', 'x < 2', 'x < -2', 'x > 2'], 2, '-3x > 6; ketika dibagi -3, tanda pertidaksamaan berbalik menjadi x < -2.'),
    soal('Penyelesaian 0,2x = 6 adalah ....', ['x = 3', 'x = 30', 'x = 12', 'x = 60'], 1, 'x = 6/0,2 = 30.'),
    soal('Penyelesaian 2(3x - 1) ≥ 4x + 8 adalah ....', ['x ≥ 5', 'x ≤ 5', 'x ≥ 3', 'x ≤ 3'], 0, '6x - 2 ≥ 4x + 8, sehingga 2x ≥ 10 dan x ≥ 5.'),

    // FUNGSI
    soal('Jika f(x) = 2x + 3, nilai f(4) adalah ....', ['11', '8', '10', '14'], 0, 'f(4) = 2(4) + 3 = 11.'),
    soal('Jika f(x) = x² - 1, nilai f(-3) adalah ....', ['-10', '-8', '10', '8'], 3, 'f(-3) = (-3)² - 1 = 9 - 1 = 8.'),
    soal('Jika f(x) = 3x - 5, bentuk f(a + 1) adalah ....', ['3a - 4', '3a + 2', '3a - 2', 'a - 2'], 2, 'f(a + 1) = 3(a + 1) - 5 = 3a - 2.'),
    soal('Domain fungsi f(x) = 1/(x - 4) adalah ....', ['semua bilangan real', 'semua bilangan real kecuali x = 4', 'x > 4 saja', 'x < 4 saja'], 1, 'Penyebut tidak boleh nol, sehingga x - 4 ≠ 0 atau x ≠ 4.'),
    soal('Domain fungsi f(x) = √(x - 2) adalah ....', ['x ≥ 2', 'x > 2', 'x ≤ 2', 'semua bilangan real'], 0, 'Bilangan di dalam akar harus tidak negatif: x - 2 ≥ 0.'),
    soal('Domain fungsi f(x) = x² - 4 adalah ....', ['x ≥ 0', 'x ≠ 4', 'x ≤ -4', 'semua bilangan real'], 3, 'Fungsi polinomial terdefinisi untuk setiap bilangan real.'),
    soal('Invers dari f(x) = 2x + 1 adalah ....', ['f⁻¹(x) = 2x - 1', 'f⁻¹(x) = (x + 1)/2', 'f⁻¹(x) = (x - 1)/2', 'f⁻¹(x) = x/2 + 1'], 2, 'Misalkan y = 2x + 1, tukar x dan y lalu selesaikan: x = (y - 1)/2.'),
    soal('Jika f(x) = x + 2 dan g(x) = 3x, nilai f(g(2)) adalah ....', ['6', '8', '10', '12'], 1, 'g(2) = 6, kemudian f(6) = 6 + 2 = 8.'),
    soal('Jika f(x) = 2x - 1 dan g(x) = x² + 3, nilai g(f(1)) adalah ....', ['4', '3', '5', '8'], 0, 'f(1) = 1, lalu g(1) = 1² + 3 = 4.'),
    soal('Gradien garis yang melalui titik (1, 3) dan (3, 7) adalah ....', ['1', '3', '4', '2'], 3, 'Gradien = (7 - 3)/(3 - 1) = 4/2 = 2.'),
    soal('Nilai x yang membuat f(x) = 2x - 6 bernilai nol adalah ....', ['-3', '2', '3', '6'], 2, '2x - 6 = 0 menghasilkan x = 3.'),
    soal('Titik puncak grafik y = x² - 4x + 1 memiliki absis ....', ['-2', '2', '1', '4'], 1, 'Absis titik puncak adalah -b/(2a) = -(-4)/(2) = 2.'),
    soal('Jika f(x) = x² dan h(x) = f(x - 2), nilai h(5) adalah ....', ['9', '5', '7', '25'], 0, 'h(5) = f(3) = 3² = 9.'),
    soal('Fungsi f(x) = x³ termasuk fungsi ....', ['genap', 'konstan', 'bukan fungsi', 'ganjil'], 3, 'f(-x) = (-x)³ = -x³ = -f(x), sehingga f merupakan fungsi ganjil.'),
    soal('Range fungsi f(x) = x² + 1 untuk x real adalah ....', ['y ≤ 1', 'y ≥ 0', 'y ≥ 1', 'semua bilangan real'], 2, 'Karena x² ≥ 0, nilai x² + 1 selalu minimal 1.'),
    soal('Nilai minimum fungsi f(x) = |x - 3| adalah ....', ['-3', '0', '1', '3'], 1, 'Nilai mutlak paling kecil adalah 0, terjadi saat x = 3.'),
    soal('Jika f(x) = ax + 2 dan f(3) = 14, nilai a adalah ....', ['4', '3', '5', '6'], 0, '3a + 2 = 14, sehingga 3a = 12 dan a = 4.'),
    soal('Jika f(x) = x² dan g(x) = x + 1, nilai f(g(2)) adalah ....', ['4', '5', '8', '9'], 3, 'g(2) = 3, sehingga f(3) = 3² = 9.'),
    soal('Domain fungsi f(x) = √(9 - x²) adalah ....', ['x ≤ 3', 'x ≥ -3', '-3 ≤ x ≤ 3', 'x < -3 atau x > 3'], 2, 'Syarat akar: 9 - x² ≥ 0, atau x² ≤ 9, sehingga -3 ≤ x ≤ 3.'),
    soal('Diketahui f(x) = 2x untuk x < 1 dan f(x) = x + 4 untuk x ≥ 1. Nilai f(2) adalah ....', ['4', '6', '5', '8'], 1, 'Karena 2 ≥ 1, gunakan aturan f(x) = x + 4; f(2) = 6.'),
    soal('Invers dari f(x) = (x + 4)/3 adalah ....', ['f⁻¹(x) = 3x - 4', 'f⁻¹(x) = (x - 4)/3', 'f⁻¹(x) = 3x + 4', 'f⁻¹(x) = x/3 - 4'], 0, 'Dari y = (x + 4)/3 diperoleh x = 3y - 4; tukar variabel untuk mendapatkan invers.'),
    soal('Gradien fungsi linear f(x) = -4x + 9 adalah ....', ['-9', '4', '9', '-4'], 3, 'Pada bentuk y = mx + c, gradien adalah koefisien x, yaitu -4.'),
    soal('Titik potong grafik y = x² dengan garis y = 9 memiliki nilai x ....', ['x = 0 atau x = 9', 'x = -9 atau x = 9', 'x = -3 atau x = 3', 'x = 3 saja'], 2, 'Samakan x² = 9, sehingga x = ±3.'),
    soal('Jika f(x) = 3x + b dan f(2) = 11, nilai b adalah ....', ['3', '5', '4', '7'], 1, '3(2) + b = 11, sehingga b = 5.'),
    soal('Banyak titik potong grafik y = x² dan y = 2x + 3 adalah ....', ['2', '0', '1', '3'], 0, 'Persamaan x² = 2x + 3 memiliki akar x = -1 dan x = 3, sehingga ada dua titik potong.'),

    // GEOMETRI
    soal('Sudut ketiga sebuah segitiga adalah .... jika dua sudut lainnya 50° dan 60°.', ['70°', '60°', '80°', '90°'], 0, 'Jumlah sudut dalam segitiga 180°, jadi 180° - 50° - 60° = 70°.'),
    soal('Luas persegi panjang dengan panjang 12 cm dan lebar 7 cm adalah ....', ['38 cm²', '76 cm²', '96 cm²', '84 cm²'], 3, 'Luas = panjang × lebar = 12 × 7 = 84 cm².'),
    soal('Luas lingkaran berjari-jari 7 cm adalah .... (π = 22/7)', ['44 cm²', '144 cm²', '154 cm²', '308 cm²'], 2, 'Luas = πr² = (22/7) × 7² = 154 cm².'),
    soal('Keliling lingkaran berdiameter 28 cm adalah .... (π = 22/7)', ['44 cm', '88 cm', '66 cm', '176 cm'], 1, 'Keliling = πd = (22/7) × 28 = 88 cm.'),
    soal('Segitiga siku-siku memiliki sisi tegak 6 cm dan 8 cm. Panjang hipotenusanya adalah ....', ['10 cm', '12 cm', '14 cm', '√28 cm'], 0, 'Menurut Teorema Pythagoras, c = √(6² + 8²) = √100 = 10 cm.'),
    soal('Luas segitiga dengan alas 10 cm dan tinggi 8 cm adalah ....', ['18 cm²', '36 cm²', '80 cm²', '40 cm²'], 3, 'Luas = 1/2 × alas × tinggi = 1/2 × 10 × 8 = 40 cm².'),
    soal('Luas trapesium dengan sisi sejajar 8 cm dan 14 cm serta tinggi 5 cm adalah ....', ['45 cm²', '60 cm²', '55 cm²', '110 cm²'], 2, 'Luas = 1/2 × (8 + 14) × 5 = 55 cm².'),
    soal('Volume kubus dengan panjang rusuk 4 cm adalah ....', ['16 cm³', '64 cm³', '48 cm³', '96 cm³'], 1, 'Volume kubus = s³ = 4³ = 64 cm³.'),
    soal('Luas permukaan kubus dengan rusuk 3 cm adalah ....', ['54 cm²', '27 cm²', '36 cm²', '81 cm²'], 0, 'Luas permukaan = 6s² = 6 × 3² = 54 cm².'),
    soal('Volume balok berukuran 2 cm × 3 cm × 5 cm adalah ....', ['10 cm³', '20 cm³', '60 cm³', '30 cm³'], 3, 'Volume balok = panjang × lebar × tinggi = 2 × 3 × 5 = 30 cm³.'),
    soal('Volume tabung berjari-jari 7 cm dan tinggi 10 cm adalah .... (π = 22/7)', ['440 cm³', '770 cm³', '1.540 cm³', '3.080 cm³'], 2, 'Volume = πr²t = (22/7) × 49 × 10 = 1.540 cm³.'),
    soal('Luas segitiga sama sisi dengan panjang sisi 6 cm adalah ....', ['18 cm²', '9√3 cm²', '6√3 cm²', '12√3 cm²'], 1, 'Luas segitiga sama sisi = (√3/4)s² = (√3/4) × 36 = 9√3 cm².'),
    soal('Jumlah sudut dalam segi enam adalah ....', ['720°', '540°', '600°', '900°'], 0, 'Jumlah sudut dalam n-sisi = (n - 2) × 180° = 4 × 180° = 720°.'),
    soal('Besar setiap sudut luar pada poligon beraturan adalah 30°. Jumlah sisinya adalah ....', ['10', '11', '15', '12'], 3, 'Jumlah sudut luar 360°, jadi jumlah sisi = 360°/30° = 12.'),
    soal('Dua segitiga sebangun memiliki perbandingan sisi 3 : 5. Perbandingan luasnya adalah ....', ['3 : 5', '6 : 10', '9 : 25', '27 : 125'], 2, 'Perbandingan luas adalah kuadrat perbandingan sisi: 3² : 5² = 9 : 25.'),
    soal('Jarak antara titik (1, 2) dan (4, 6) pada bidang koordinat adalah ....', ['4 satuan', '5 satuan', '6 satuan', '7 satuan'], 1, 'Jarak = √[(4 - 1)² + (6 - 2)²] = √(9 + 16) = 5.'),
    soal('Titik tengah ruas garis dengan ujung (-2, 4) dan (6, 8) adalah ....', ['(2, 6)', '(4, 6)', '(2, 4)', '(−4, 6)'], 0, 'Titik tengah = ((-2 + 6)/2, (4 + 8)/2) = (2, 6).'),
    soal('Gradien garis yang melalui (2, 3) dan (6, 11) adalah ....', ['1/2', '4', '8', '2'], 3, 'Gradien = (11 - 3)/(6 - 2) = 8/4 = 2.'),
    soal('Lingkaran berpusat di (0, 0) dengan jari-jari 5 memotong sumbu-x di titik dengan koordinat x ....', ['0 dan 5', '-10 dan 10', '-5 dan 5', '-5 saja'], 2, 'Pada sumbu-x, y = 0; persamaan x² + y² = 25 menjadi x² = 25, sehingga x = ±5.'),
    soal('Luas juring 90° pada lingkaran berjari-jari 14 cm adalah .... (π = 22/7)', ['77 cm²', '154 cm²', '308 cm²', '616 cm²'], 1, 'Luas juring = 90°/360° × πr² = 1/4 × (22/7) × 196 = 154 cm².'),
    soal('Diagonal persegi dengan sisi 10 cm adalah ....', ['10√2 cm', '5√2 cm', '20 cm', '100 cm'], 0, 'Diagonal persegi d = s√2 = 10√2 cm.'),
    soal('Prisma memiliki luas alas segitiga 12 cm² dan panjang 8 cm. Volumenya adalah ....', ['20 cm³', '48 cm³', '192 cm³', '96 cm³'], 3, 'Volume prisma = luas alas × panjang = 12 × 8 = 96 cm³.'),
    soal('Volume kerucut berjari-jari 3 cm dan tinggi 4 cm adalah ....', ['36π cm³', '9π cm³', '12π cm³', '16π cm³'], 2, 'Volume kerucut = 1/3 πr²t = 1/3 × π × 9 × 4 = 12π cm³.'),
    soal('Luas jajar genjang dengan alas 15 cm dan tinggi 6 cm adalah ....', ['45 cm²', '90 cm²', '42 cm²', '180 cm²'], 1, 'Luas jajar genjang = alas × tinggi = 15 × 6 = 90 cm².'),
    soal('Jumlah sudut dalam segi empat adalah ....', ['360°', '180°', '270°', '540°'], 0, 'Jumlah sudut dalam segi empat = (4 - 2) × 180° = 360°.'),

    // STATISTIKA
    soal('Rata-rata data 6, 8, 10, dan 12 adalah ....', ['9', '8', '10', '11'], 0, 'Rata-rata = (6 + 8 + 10 + 12)/4 = 36/4 = 9.'),
    soal('Median dari data 3, 5, 7, 9, 11 adalah ....', ['5', '8', '9', '7'], 3, 'Data sudah berurutan dan ada lima nilai; median adalah nilai ketiga, yaitu 7.'),
    soal('Modus dari data 2, 3, 3, 4, 5, 3, 6 adalah ....', ['2', '4', '3', '5'], 2, 'Angka 3 muncul paling sering, yaitu tiga kali.'),
    soal('Jangkauan data 12, 18, 5, 21, 9 adalah ....', ['12', '16', '14', '17'], 1, 'Jangkauan = nilai maksimum - minimum = 21 - 5 = 16.'),
    soal('Rata-rata lima bilangan adalah 12. Empat bilangan pertama berjumlah 42. Bilangan kelima adalah ....', ['18', '12', '15', '20'], 0, 'Jumlah lima bilangan = 5 × 12 = 60; bilangan kelima = 60 - 42 = 18.'),
    soal('Median dari data 4, 6, 8, dan 12 adalah ....', ['6', '8', '9', '7'], 3, 'Karena jumlah data genap, median = (6 + 8)/2 = 7.'),
    soal('Nilai rata-rata ujian seorang siswa untuk 2 mata pelajaran adalah 80 dan untuk 3 mata pelajaran lainnya 90. Rata-rata seluruh 5 mata pelajaran adalah ....', ['85', '87', '86', '88'], 2, 'Rata-rata gabungan = (2×80 + 3×90)/5 = 430/5 = 86.'),
    soal('Rata-rata data 2, 4, 6, 8, dan 10 adalah ....', ['5', '6', '7', '8'], 1, 'Jumlah data 30 dibagi 5 menghasilkan rata-rata 6.'),
    soal('Varians populasi dari data 2, 2, 4, dan 4 adalah ....', ['1', '0', '2', '4'], 0, 'Rata-rata 3; kuadrat selisihnya 1, 1, 1, 1. Varians = 4/4 = 1.'),
    soal('Simpangan baku data 5, 5, 5, 5 adalah ....', ['1', '2', '5', '0'], 3, 'Semua nilai sama dengan rata-ratanya, sehingga seluruh simpangan nol.'),
    soal('Nilai 1 muncul 2 kali, nilai 2 muncul 3 kali, dan nilai 3 muncul 5 kali. Rata-ratanya adalah ....', ['2', '2,5', '2,3', '3'], 2, 'Rata-rata = (1×2 + 2×3 + 3×5)/(2 + 3 + 5) = 23/10 = 2,3.'),
    soal('Dari 60 siswa, 15 siswa memilih klub sains. Frekuensi relatif pemilih klub sains adalah ....', ['15%', '25%', '20%', '40%'], 1, 'Frekuensi relatif = 15/60 × 100% = 25%.'),
    soal('Dalam diagram lingkaran, 40% dari 200 siswa memilih olahraga. Banyak siswa tersebut adalah ....', ['80 siswa', '40 siswa', '60 siswa', '100 siswa'], 0, '40% × 200 = 80 siswa.'),
    soal('Kuartil bawah (Q1) dari data 2, 4, 6, 8, 10, 12, 14 adalah ....', ['2', '6', '8', '4'], 3, 'Bagian bawah data adalah 2, 4, 6; mediannya 4, sehingga Q1 = 4.'),
    soal('Kuartil atas (Q3) dari data 2, 4, 6, 8, 10, 12, 14 adalah ....', ['10', '11', '12', '14'], 2, 'Bagian atas data adalah 10, 12, 14; mediannya 12, sehingga Q3 = 12.'),
    soal('Jika semua data ditambah 5, rata-rata awal 20 akan menjadi ....', ['20', '25', '15', '100'], 1, 'Menambah konstanta 5 pada setiap data menaikkan rata-rata sebesar 5.'),
    soal('Ukuran pemusatan yang paling mudah terpengaruh nilai pencilan ekstrem adalah ....', ['rata-rata', 'median', 'modus', 'kuartil bawah'], 0, 'Rata-rata menggunakan semua nilai data sehingga lebih mudah bergeser akibat pencilan ekstrem.'),
    soal('Varians populasi dari data 2, 4, 4, dan 6 adalah ....', ['1', '4', '8', '2'], 3, 'Rata-rata 4; kuadrat selisih 4, 0, 0, 4. Varians = 8/4 = 2.'),
    soal('Median dari data 10, 2, 7, 4, 9 adalah ....', ['4', '6', '7', '9'], 2, 'Urutkan data menjadi 2, 4, 7, 9, 10; nilai tengahnya 7.'),
    soal('Data 4, 4, 5, 5, 6 memiliki modus ....', ['4 saja', '4 dan 5', '5 saja', '6 saja'], 1, 'Nilai 4 dan 5 sama-sama muncul dua kali, paling sering dibanding nilai lain.'),
    soal('Nilai 70 diperoleh 2 siswa, nilai 80 oleh 3 siswa, dan nilai 90 oleh 5 siswa. Rata-rata seluruh nilai adalah ....', ['83', '80', '82', '85'], 0, 'Rata-rata = (70×2 + 80×3 + 90×5)/10 = 830/10 = 83.'),
    soal('Rata-rata 6 kali tes adalah 80. Jumlah seluruh nilai tes adalah ....', ['86', '400', '560', '480'], 3, 'Jumlah nilai = rata-rata × banyak tes = 80 × 6 = 480.'),
    soal('Jika setiap nilai dalam suatu data dikalikan 3, jangkauan data baru menjadi ....', ['sama dengan semula', '1/3 kali semula', '3 kali jangkauan semula', '9 kali semula'], 2, 'Nilai maksimum dan minimum sama-sama dikalikan 3, sehingga selisihnya juga menjadi tiga kali.'),
    soal('Korelasi negatif antara dua variabel menunjukkan bahwa ....', ['kedua variabel selalu meningkat bersama', 'ketika satu variabel meningkat, variabel lain cenderung menurun', 'kedua variabel tidak berkaitan sama sekali', 'kedua variabel selalu bernilai sama'], 1, 'Korelasi negatif menunjukkan kecenderungan hubungan berlawanan arah.'),
    soal('Pada diagram lingkaran, bagian 30% memiliki sudut pusat sebesar ....', ['108°', '90°', '100°', '120°'], 0, 'Sudut pusat = 30% × 360° = 108°.'),

    // PELUANG
    soal('Sebuah dadu bersisi enam dilempar sekali. Peluang muncul angka genap adalah ....', ['1/2', '1/3', '2/3', '5/6'], 0, 'Angka genap adalah 2, 4, dan 6; peluang = 3/6 = 1/2.'),
    soal('Sebuah koin seimbang dilempar dua kali. Peluang muncul gambar pada kedua lemparan adalah ....', ['1/2', '1/3', '3/4', '1/4'], 3, 'Peluang gambar pada setiap lemparan 1/2, jadi peluang keduanya gambar = 1/2 × 1/2 = 1/4.'),
    soal('Dalam kantong terdapat 3 bola merah dan 2 bola biru. Peluang mengambil bola merah adalah ....', ['2/5', '1/2', '3/5', '3/2'], 2, 'Ada 3 bola merah dari total 5 bola, sehingga peluangnya 3/5.'),
    soal('Satu kartu diambil acak dari satu set kartu remi standar 52 kartu. Peluang mendapat kartu As adalah ....', ['1/4', '1/13', '4/13', '1/52'], 1, 'Terdapat 4 kartu As dari 52 kartu, jadi peluang = 4/52 = 1/13.'),
    soal('Sebuah dadu dilempar sekali. Peluang muncul angka lebih dari 4 adalah ....', ['1/3', '1/6', '1/2', '2/3'], 0, 'Angka yang lebih dari 4 adalah 5 dan 6, jadi peluang = 2/6 = 1/3.'),
    soal('Dua dadu dilempar bersamaan. Peluang jumlah mata dadu sama dengan 7 adalah ....', ['1/12', '1/4', '1/3', '1/6'], 3, 'Ada 6 pasangan yang jumlahnya 7 dari 36 hasil sama mungkin, sehingga 6/36 = 1/6.'),
    soal('Sebuah koin seimbang dilempar dua kali. Peluang muncul minimal satu gambar adalah ....', ['1/4', '1/2', '3/4', '1'], 2, 'Hasil yang memenuhi GG, GA, dan AG ada 3 dari 4 kemungkinan; peluangnya 3/4.'),
    soal('Satu bilangan dipilih acak dari 1 sampai 5. Peluang terpilih bilangan prima adalah ....', ['1/5', '3/5', '2/5', '4/5'], 1, 'Bilangan prima adalah 2, 3, dan 5, yaitu 3 dari 5 bilangan.'),
    soal('Kantong berisi 4 bola merah dan 3 bola biru. Dua bola diambil tanpa pengembalian. Peluang keduanya merah adalah ....', ['2/7', '4/7', '1/3', '3/7'], 0, 'Peluang = 4/7 × 3/6 = 12/42 = 2/7.'),
    soal('Jika peluang suatu kejadian adalah 0,35, peluang kejadian itu tidak terjadi adalah ....', ['0,35', '0,75', '1,35', '0,65'], 3, 'Peluang komplemen = 1 - 0,35 = 0,65.'),
    soal('Sebuah koin seimbang dilempar tiga kali. Peluang tepat dua kali muncul angka adalah ....', ['1/8', '1/4', '3/8', '1/2'], 2, 'Ada C(3,2) = 3 susunan dengan tepat dua angka, dari 2³ = 8 hasil.'),
    soal('Dua dadu dilempar bersamaan. Peluang jumlah mata dadu sama dengan 8 adalah ....', ['1/6', '5/36', '1/9', '7/36'], 1, 'Pasangan jumlah 8: (2,6), (3,5), (4,4), (5,3), (6,2), ada 5 dari 36.'),
    soal('Satu bilangan dipilih acak dari 1 sampai 10. Peluang bilangan itu kelipatan 3 adalah ....', ['3/10', '1/10', '2/5', '1/2'], 0, 'Kelipatan 3 yang tersedia adalah 3, 6, 9; ada 3 dari 10 bilangan.'),
    soal('Dari 5 siswi dan 3 siswa dipilih 2 orang secara acak. Peluang keduanya siswi adalah ....', ['1/2', '5/8', '10/14', '5/14'], 3, 'Peluang = C(5,2)/C(8,2) = 10/28 = 5/14.'),
    soal('Sebuah pemutar memiliki 8 bagian sama besar, dengan 3 bagian berwarna hijau. Peluang jarum berhenti di hijau adalah ....', ['1/8', '5/8', '3/8', '3/5'], 2, 'Tiga dari delapan bagian berwarna hijau, jadi peluangnya 3/8.'),
    soal('Kotak berisi 4 kartu merah, 6 biru, dan 5 hijau. Peluang mengambil kartu biru atau hijau adalah ....', ['4/15', '11/15', '9/15', '10/15'], 1, 'Kartu biru atau hijau berjumlah 6 + 5 = 11 dari total 15 kartu.'),
    soal('Kotak berisi 3 bola merah dan 2 bola putih. Dua bola diambil tanpa pengembalian. Peluang keduanya merah adalah ....', ['3/10', '1/5', '2/5', '3/5'], 0, 'Peluang = 3/5 × 2/4 = 6/20 = 3/10.'),
    soal('Dua kejadian A dan B saling bebas dengan P(A) = 0,6 dan P(B) = 0,5. Nilai P(A ∩ B) adalah ....', ['0,1', '0,5', '1,1', '0,3'], 3, 'Untuk kejadian saling bebas, P(A ∩ B) = P(A) × P(B) = 0,6 × 0,5 = 0,3.'),
    soal('Kejadian A dan B saling lepas dengan P(A) = 0,2 dan P(B) = 0,3. Nilai P(A ∪ B) adalah ....', ['0,06', '0,3', '0,5', '0,6'], 2, 'Untuk kejadian saling lepas, P(A ∪ B) = P(A) + P(B) = 0,5.'),
    soal('Dalam kantong terdapat 3 bola merah dan 2 bola biru. Jika bola pertama yang diambil merah dan tidak dikembalikan, peluang bola kedua merah adalah ....', ['2/5', '1/2', '3/5', '1/3'], 1, 'Setelah satu bola merah diambil, tersisa 2 merah dari 4 bola, sehingga peluangnya 2/4 = 1/2.'),
    soal('Satu bilangan dipilih acak dari 1 sampai 20. Peluang bilangan tersebut habis dibagi 4 atau 5 adalah ....', ['2/5', '1/4', '1/2', '3/5'], 0, 'Bilangan yang memenuhi: 4, 5, 8, 10, 12, 15, 16, 20; ada 8 dari 20, yaitu 2/5.'),
    soal('Dua dadu dilempar bersamaan. Peluang hasil kali mata dadu genap adalah ....', ['1/4', '1/2', '5/6', '3/4'], 3, 'Hasil kali ganjil hanya jika kedua dadu ganjil, peluangnya 1/2 × 1/2 = 1/4; komplemennya 3/4.'),
    soal('Empat soal benar-salah dijawab dengan menebak acak. Peluang semua jawaban benar adalah ....', ['1/4', '1/8', '1/16', '1/2'], 2, 'Setiap jawaban benar berpeluang 1/2 dan saling bebas, sehingga (1/2)⁴ = 1/16.'),
    soal('Dari 7 siswa dipilih 2 siswa secara acak. Peluang dua siswa tertentu sama-sama terpilih adalah ....', ['1/7', '1/21', '2/7', '1/14'], 1, 'Total pasangan = C(7,2) = 21; hanya satu pasangan yang berisi dua siswa tertentu, jadi 1/21.'),
    soal('Peluang menang pada satu permainan adalah 0,1. Jika bermain 3 kali secara saling bebas, peluang menang setidaknya sekali adalah ....', ['0,271', '0,100', '0,300', '0,729'], 0, 'Peluang tidak menang sekali pun = 0,9³ = 0,729; komplemennya 1 - 0,729 = 0,271.'),

    // BARISAN DAN DERET
    soal('Barisan aritmetika memiliki suku pertama 3 dan beda 4. Suku kelima adalah ....', ['19', '15', '17', '23'], 0, 'a₅ = a₁ + 4d = 3 + 4(4) = 19.'),
    soal('Suku berikutnya dari barisan geometri 2, 6, 18, ... adalah ....', ['36', '48', '72', '54'], 3, 'Rasio = 6/2 = 3, maka suku berikutnya 18 × 3 = 54.'),
    soal('Jumlah 10 bilangan bulat positif pertama adalah ....', ['45', '50', '55', '60'], 2, 'Jumlah = n(n + 1)/2 = 10 × 11/2 = 55.'),
    soal('Barisan aritmetika memiliki suku pertama 7 dan beda 3. Suku ke-12 adalah ....', ['34', '40', '37', '43'], 1, 'a₁₂ = 7 + (12 - 1)×3 = 7 + 33 = 40.'),
    soal('Jumlah 8 suku pertama deret 2 + 5 + 8 + ... adalah ....', ['100', '92', '96', '104'], 0, 'a₈ = 2 + 7×3 = 23; S₈ = 8/2 × (2 + 23) = 100.'),
    soal('Barisan geometri memiliki suku pertama 3 dan rasio 2. Suku keenamnya adalah ....', ['48', '64', '192', '96'], 3, 'a₆ = 3 × 2⁵ = 96.'),
    soal('Jumlah deret 1 + 2 + 4 + 8 + 16 + 32 adalah ....', ['31', '62', '63', '64'], 2, 'Jumlahnya 1 + 2 + 4 + 8 + 16 + 32 = 63.'),
    soal('Suku berikutnya dari barisan 2, 3, 5, 8, 13, ... adalah ....', ['18', '21', '20', '26'], 1, 'Setiap suku adalah jumlah dua suku sebelumnya: 8 + 13 = 21.'),
    soal('Suku ke-n suatu barisan adalah aₙ = 5n - 2. Suku ke-20 adalah ....', ['98', '88', '100', '102'], 0, 'a₂₀ = 5(20) - 2 = 98.'),
    soal('Barisan aritmetika memiliki a₃ = 11 dan beda 4. Suku pertamanya adalah ....', ['-1', '7', '15', '3'], 3, 'a₃ = a₁ + 2d, sehingga 11 = a₁ + 8 dan a₁ = 3.'),
    soal('Barisan geometri memiliki a₂ = 6 dan a₅ = 162 dengan rasio positif. Rasio barisan adalah ....', ['2', '4', '3', '6'], 2, 'a₅/a₂ = r³ = 162/6 = 27, sehingga r = 3.'),
    soal('Jumlah deret geometri tak hingga 12 + 4 + 4/3 + ... adalah ....', ['16', '18', '20', '24'], 1, 'a = 12 dan r = 1/3; jumlah tak hingga = a/(1 - r) = 12/(2/3) = 18.'),
    soal('Jumlah 20 suku pertama barisan 1, 3, 5, 7, ... adalah ....', ['400', '200', '380', '420'], 0, 'Jumlah 20 bilangan ganjil pertama adalah 20² = 400.'),
    soal('Suku berikutnya dari barisan geometri 81, 27, 9, ... adalah ....', ['1', '6', '−3', '3'], 3, 'Rasio = 1/3, sehingga suku selanjutnya 9 × 1/3 = 3.'),
    soal('Pada barisan 4, 7, 10, 13, ..., suku bernilai 40 adalah suku ke-....', ['12', '14', '13', '15'], 2, '4 + (n - 1)×3 = 40, maka 3(n - 1) = 36 dan n = 13.'),
    soal('Jumlah 10 suku pertama deret 3 + 6 + 9 + ... adalah ....', ['150', '165', '160', '180'], 1, 'Suku ke-10 = 30; jumlah = 10/2 × (3 + 30) = 165.'),
    soal('Suku berikutnya dari barisan 5, -10, 20, -40, ... adalah ....', ['80', '-80', '60', '-60'], 0, 'Rasio barisan adalah -2, sehingga suku berikutnya = -40 × (-2) = 80.'),
    soal('Barisan aritmetika memiliki suku pertama 4 dan suku ketujuh 22. Bedanya adalah ....', ['2', '4', '6', '3'], 3, 'a₇ = 4 + 6d = 22, sehingga 6d = 18 dan d = 3.'),
    soal('Jumlah deret 2 + 5 + 8 + ... + 29 adalah ....', ['145', '150', '155', '160'], 2, 'Banyak suku n = (29 - 2)/3 + 1 = 10; jumlah = 10/2 × (2 + 29) = 155.'),
    soal('Jumlah empat suku pertama deret geometri 4 + 2 + 1 + ... adalah ....', ['7', '7,5', '8', '8,5'], 1, 'Empat suku pertama: 4 + 2 + 1 + 0,5 = 7,5.'),
    soal('Suku berikutnya dari barisan 1, 4, 9, 16, ... adalah ....', ['25', '20', '24', '36'], 0, 'Barisan merupakan kuadrat bilangan asli: 1², 2², 3², 4²; berikutnya 5² = 25.'),
    soal('Suku ke-n barisan aritmetika adalah aₙ = 2n + 1. Jumlah 15 suku pertamanya adalah ....', ['225', '240', '270', '255'], 3, 'Suku pertama 3 dan suku ke-15 31; jumlah = 15/2 × (3 + 31) = 255.'),
    soal('Jumlah lima suku pertama deret geometri dengan suku pertama 2 dan rasio 3 adalah ....', ['121', '240', '242', '486'], 2, 'Suku-sukunya 2, 6, 18, 54, 162; jumlahnya 242.'),
    soal('Suku ke-8 dari barisan geometri 7, 14, 28, ... adalah ....', ['448', '896', '784', '1.024'], 1, 'a₈ = 7 × 2⁷ = 896.'),
    soal('Jumlah kursi pada 10 baris aula berturut-turut adalah 12, 15, 18, ... kursi. Jumlah seluruh kursi adalah ....', ['255', '240', '270', '285'], 0, 'Barisan aritmetika dengan a₁ = 12 dan d = 3; a₁₀ = 39. Jumlah = 10/2 × (12 + 39) = 255.'),
  ],
  fisika: [
     soal('Dalam SI, satuan dasar untuk panjang adalah ...', ['kilogram', 'meter', 'sekon', 'kelvin'], 1, 'Satuan dasar panjang dalam SI adalah meter (m).'),
    soal('Satuan dasar massa dalam SI adalah ...', ['kilogram', 'gram', 'newton', 'liter'], 0, 'Satuan dasar massa dalam SI adalah kilogram (kg).'),
    soal('Satuan dasar waktu dalam SI adalah ...', ['menit', 'jam', 'sekon', 'hari'], 2, 'Satuan dasar waktu dalam SI adalah sekon (s).'),
    soal('Satuan dasar suhu termodinamik dalam SI adalah ...', ['derajat Celsius', 'fahrenheit', 'joule', 'kelvin'], 3, 'Satuan dasar suhu termodinamik adalah kelvin (K).'),
    soal('Satuan SI untuk kuat arus listrik adalah ...', ['volt', 'ampere', 'ohm', 'watt'], 1, 'Kuat arus listrik diukur dalam ampere (A).'),
    soal('Satuan SI untuk intensitas cahaya adalah ...', ['mol', 'candela', 'ampere', 'kelvin'], 1, 'Intensitas cahaya merupakan besaran pokok dengan satuan candela (cd).'),
    soal('Satuan SI untuk jumlah zat adalah ...', ['mol', 'kilogram', 'meter', 'newton'], 0, 'Jumlah zat diukur dalam mol (mol).'),
    soal('Satuan SI untuk kelajuan adalah ...', ['m/s²', 'kg/m³', 'N', 'm/s'], 3, 'Kelajuan adalah jarak dibagi waktu, sehingga satuannya m/s.'),
    soal('Satuan SI untuk gaya adalah ...', ['joule', 'newton', 'watt', 'pascal'], 1, 'Gaya diukur dalam newton (N).'),
    soal('Satuan SI untuk massa jenis adalah ...', ['kg/m³', 'kg m', 'N/m²', 'm/s'], 0, 'Massa jenis adalah massa per volume, dengan satuan kg/m³.'),
    soal('Satuan SI untuk volume adalah ...', ['cm', 'm²', 'm³', 'kg'], 2, 'Volume merupakan besaran turunan dengan satuan SI meter kubik (m³).'),
    soal('Alat yang paling tepat untuk mengukur diameter kawat tipis adalah ...', ['mistar', 'stopwatch', 'neraca', 'mikrometer sekrup'], 3, 'Mikrometer sekrup cocok mengukur diameter atau ketebalan yang sangat kecil.'),
    soal('Alat untuk mengukur massa suatu benda adalah ...', ['termometer', 'barometer', 'neraca', 'amperemeter'], 2, 'Neraca digunakan untuk mengukur massa.'),
    soal('Panjang 2,5 km sama dengan ...', ['2.500 m', '250 m', '25.000 m', '0,25 m'], 0, 'Karena 1 km = 1.000 m, maka 2,5 km = 2.500 m.'),
    soal('Panjang 350 cm sama dengan ...', ['35 m', '3,5 m', '0,35 m', '3500 m'], 1, 'Karena 100 cm = 1 m, maka 350 cm = 3,5 m.'),
    soal('Massa 750 gram sama dengan ...', ['7,5 kg', '75 kg', '0,75 kg', '0,075 kg'], 2, '750 gram dibagi 1.000 = 0,75 kg.'),
    soal('Waktu 2 jam sama dengan ...', ['120 s', '3.600 s', '10.800 s', '7.200 s'], 3, '2 jam = 2 × 3.600 sekon = 7.200 sekon.'),
    soal('Kelajuan 54 km/jam setara dengan ...', ['10 m/s', '15 m/s', '18 m/s', '20 m/s'], 1, 'Untuk mengubah km/jam ke m/s, bagi 3,6. Jadi 54 ÷ 3,6 = 15 m/s.'),
    soal('Volume 250 cm³ sama dengan ...', ['2,5 × 10⁻³ m³', '2,5 × 10⁻⁵ m³', '2,5 × 10⁻⁴ m³', '2,5 m³'], 2, '1 cm³ = 10⁻⁶ m³, sehingga 250 cm³ = 2,5 × 10⁻⁴ m³.'),
    soal('Manakah yang termasuk besaran skalar?', ['energi', 'perpindahan', 'kecepatan', 'gaya'], 0, 'Energi hanya memiliki nilai, tanpa arah, sehingga termasuk besaran skalar.'),
    soal('Manakah yang termasuk besaran vektor?', ['massa', 'suhu', 'waktu', 'percepatan'], 3, 'Percepatan memiliki besar dan arah, sehingga termasuk besaran vektor.'),
    soal('Dimensi gaya menurut M, L, dan T adalah ...', ['[M L T⁻¹]', '[M L T⁻²]', '[M L² T⁻²]', '[M T⁻²]'], 1, 'Gaya F = m a, sehingga dimensinya M × (L T⁻²) = [M L T⁻²].'),
    soal('Bilangan 12,30 memiliki berapa angka penting?', ['2', '3', '4', '5'], 2, 'Angka nol di belakang koma pada 12,30 merupakan angka penting; totalnya 4.'),

    // GERAK
    soal('Mobil bergerak dengan kelajuan tetap 15 m/s selama 8 s. Jarak yang ditempuh adalah ...', ['120 m', '60 m', '180 m', '23 m'], 0, 'Jarak = v × t = 15 × 8 = 120 m.'),
    soal('Sepeda menempuh 120 km selama 3 jam. Kelajuan rata-ratanya adalah ...', ['30 km/jam', '40 km/jam', '60 km/jam', '360 km/jam'], 1, 'Kelajuan rata-rata = jarak/waktu = 120/3 = 40 km/jam.'),
    soal('Kelajuan 72 km/jam sama dengan ...', ['12 m/s', '18 m/s', '25 m/s', '20 m/s'], 3, '72 km/jam dibagi 3,6 sama dengan 20 m/s.'),
    soal('Benda dari keadaan diam dipercepat 3 m/s² selama 4 s. Kelajuan akhirnya ...', ['7 m/s', '12 m/s', '15 m/s', '24 m/s'], 1, 'v = v₀ + at = 0 + 3 × 4 = 12 m/s.'),
    soal('Benda memiliki kelajuan awal 5 m/s dan percepatan 2 m/s² selama 3 s. Kelajuan akhirnya ...', ['6 m/s', '8 m/s', '11 m/s', '15 m/s'], 2, 'v = v₀ + at = 5 + 2 × 3 = 11 m/s.'),
    soal('Benda berangkat dari diam dengan percepatan 2 m/s² selama 5 s. Jarak yang ditempuh ...', ['10 m', '20 m', '50 m', '25 m'], 3, 's = ½at² = ½ × 2 × 25 = 25 m.'),
    soal('Benda bergerak dengan v₀ = 10 m/s dan a = 2 m/s² selama 4 s. Perpindahannya ...', ['56 m', '40 m', '48 m', '64 m'], 0, 's = v₀t + ½at² = 10(4) + ½(2)(16) = 56 m.'),
    soal('Kelajuan benda meningkat dari 10 m/s menjadi 30 m/s dalam 5 s. Percepatannya ...', ['2 m/s²', '4 m/s²', '5 m/s²', '8 m/s²'], 1, 'a = (v − v₀)/t = (30 − 10)/5 = 4 m/s².'),
    soal('Benda jatuh bebas dari ketinggian 20 m. Jika g = 10 m/s², waktu jatuhnya ...', ['1 s', '4 s', '2 s', '5 s'], 2, 'h = ½gt², sehingga 20 = 5t² dan t = 2 s.'),
    soal('Benda dilempar vertikal ke atas dengan kecepatan awal 20 m/s. Jika g = 10 m/s², tinggi maksimum ...', ['10 m', '15 m', '30 m', '20 m'], 3, 'Tinggi maksimum h = v₀²/(2g) = 400/20 = 20 m.'),
    soal('Seseorang berjalan 10 m ke timur lalu kembali 10 m ke barat ke titik awal. Perpindahan totalnya ...', ['0 m', '10 m', '20 m', '5 m'], 0, 'Posisi akhir sama dengan posisi awal, maka perpindahan total nol.'),
    soal('Pelari menempuh 100 m dalam 20 s. Kelajuan rata-ratanya ...', ['2 m/s', '5 m/s', '10 m/s', '20 m/s'], 1, 'Kelajuan rata-rata = 100/20 = 5 m/s.'),
    soal('Pada gerak lurus beraturan (GLB), percepatan benda adalah ...', ['selalu bertambah', 'selalu negatif', 'nol', 'selalu 10 m/s²'], 2, 'Dalam GLB, kecepatan tetap sehingga percepatan sama dengan nol.'),
    soal('Kemiringan grafik posisi terhadap waktu menyatakan ...', ['gaya', 'massa', 'energi', 'kecepatan'], 3, 'Gradien grafik posisi-waktu menyatakan kecepatan.'),
    soal('Dua pelari berjarak 100 m dan berlari saling mendekat dengan kelajuan 4 m/s dan 6 m/s. Mereka bertemu setelah ...', ['10 s', '15 s', '20 s', '25 s'], 0, 'Kelajuan relatif = 4 + 6 = 10 m/s; waktu = 100/10 = 10 s.'),
    soal('Dua kendaraan searah memiliki kelajuan 20 m/s dan 15 m/s. Jika jarak awal 50 m, waktu kendaraan cepat menyusul ...', ['5 s', '10 s', '15 s', '25 s'], 1, 'Kelajuan relatif = 20 − 15 = 5 m/s; waktu = 50/5 = 10 s.'),
    soal('Pada gerak melingkar beraturan, besaran yang tetap adalah ...', ['arah kecepatan', 'vektor kecepatan', 'kelajuan', 'percepatan vektor'], 2, 'Kelajuan tetap, tetapi arah kecepatan berubah terus-menerus.'),
    soal('Kelajuan benda turun dari 20 m/s menjadi 0 dalam 4 s. Percepatannya ...', ['5 m/s²', '0 m/s²', '−4 m/s²', '−5 m/s²'], 3, 'a = (0 − 20)/4 = −5 m/s².'),
    soal('Mobil melambat dari 20 m/s dengan percepatan −5 m/s² hingga berhenti. Jarak pengereman ...', ['40 m', '20 m', '80 m', '100 m'], 0, 'Gunakan v² = v₀² + 2as: 0 = 400 − 10s, sehingga s = 40 m.'),
    soal('Benda jatuh bebas selama 3 s dengan g = 10 m/s². Jarak jatuhnya ...', ['15 m', '45 m', '30 m', '90 m'], 1, 'h = ½gt² = ½ × 10 × 9 = 45 m.'),
    soal('Sebuah kendaraan menempuh 150 m dalam 30 s. Kelajuan rata-ratanya ...', ['3 m/s', '4 m/s', '5 m/s', '6 m/s'], 2, 'Kelajuan rata-rata = 150/30 = 5 m/s.'),
    soal('Seseorang berpindah 40 m ke timur selama 10 s. Kecepatan rata-ratanya ...', ['2 m/s ke timur', '5 m/s ke timur', '10 m/s ke timur', '4 m/s ke timur'], 3, 'Kecepatan rata-rata = perpindahan/waktu = 40/10 = 4 m/s ke timur.'),

    // GAYA
    soal('Hukum I Newton dikenal juga sebagai hukum ...', ['inersia atau kelembaman', 'aksi-reaksi', 'gravitasi universal', 'usaha'], 0, 'Hukum I Newton menyatakan kecenderungan benda mempertahankan keadaan geraknya (inersia).'),
    soal('Gaya resultan 10 N bekerja pada benda bermassa 5 kg. Percepatan benda ...', ['1 m/s²', '2 m/s²', '5 m/s²', '50 m/s²'], 1, 'Hukum II Newton: a = F/m = 10/5 = 2 m/s².'),
    soal('Gaya resultan 12 N bekerja pada massa 3 kg. Percepatannya ...', ['2 m/s²', '3 m/s²', '4 m/s²', '36 m/s²'], 2, 'a = F/m = 12/3 = 4 m/s².'),
    soal('Benda bermassa 5 kg mengalami percepatan 4 m/s². Gaya resultannya ...', ['5 N', '9 N', '15 N', '20 N'], 3, 'F = ma = 5 × 4 = 20 N.'),
    soal('Gaya 6 N bekerja pada benda bermassa 2 kg. Percepatan benda ...', ['3 m/s²', '4 m/s²', '8 m/s²', '12 m/s²'], 0, 'a = F/m = 6/2 = 3 m/s².'),
    soal('Berat benda bermassa 4 kg jika g = 10 m/s² adalah ...', ['4 N', '40 N', '0,4 N', '400 N'], 1, 'Berat w = mg = 4 × 10 = 40 N.'),
    soal('Berat benda 60 N di tempat dengan g = 10 m/s². Massa benda ...', ['10 kg', '60 kg', '6 kg', '600 kg'], 2, 'm = w/g = 60/10 = 6 kg.'),
    soal('Hukum III Newton menyatakan bahwa ...', ['gaya selalu menyebabkan benda diam', 'resultan gaya selalu nol', 'energi tidak dapat berubah', 'setiap aksi memiliki reaksi sama besar berlawanan arah'], 3, 'Pasangan aksi-reaksi sama besar, berlawanan arah, dan bekerja pada dua benda berbeda.'),
    soal('Gaya aksi dan reaksi tidak saling meniadakan karena ...', ['bekerja pada benda yang berbeda', 'besarnya selalu berbeda', 'arahnya selalu sama', 'terjadi pada waktu berbeda'], 0, 'Aksi dan reaksi bekerja pada dua benda berbeda.'),
    soal('Benda diam di atas meja datar dan tidak mengalami percepatan. Resultan gayanya ...', ['10 N', 'nol', 'sama dengan massanya', 'selalu ke bawah'], 1, 'Jika percepatan nol, Hukum II Newton menyatakan resultan gaya nol.'),
    soal('Dua gaya berlawanan arah sebesar 15 N dan 9 N bekerja pada benda. Resultannya ...', ['24 N ke gaya 9 N', '15 N ke gaya 15 N', '6 N ke arah gaya 15 N', '0 N'], 2, 'Resultan = 15 − 9 = 6 N, arahnya mengikuti gaya yang lebih besar.'),
    soal('Dua gaya searah sebesar 4 N dan 7 N menghasilkan resultan ...', ['3 N', '7 N', '4 N', '11 N'], 3, 'Gaya searah dijumlahkan: 4 + 7 = 11 N.'),
    soal('Arah gaya gesek pada benda yang meluncur di permukaan umumnya ...', ['berlawanan dengan arah gerak relatif', 'searah gerak selalu', 'selalu vertikal ke atas', 'selalu menuju pusat bumi'], 0, 'Gaya gesek melawan kecenderungan gerak relatif antara permukaan.'),
    soal('Koefisien gesek 0,2 dan gaya normal 100 N. Besar gaya gesek maksimum ...', ['5 N', '20 N', '50 N', '200 N'], 1, 'f = μN = 0,2 × 100 = 20 N.'),
    soal('Benda bermassa 3 kg berada di bidang datar tanpa gaya vertikal lain. Jika g = 10 m/s², gaya normalnya ...', ['3 N', '10 N', '30 N', '60 N'], 2, 'Pada bidang datar, gaya normal seimbang dengan berat: N = mg = 30 N.'),
    soal('Benda yang sudah bergerak akan terus bergerak lurus beraturan jika ...', ['massanya menjadi nol', 'gaya gesek bertambah', 'gaya gravitasi hilang', 'resultan gaya padanya nol'], 3, 'Menurut Hukum I Newton, resultan gaya nol membuat kecepatan tetap.'),
    soal('Ukuran kelembaman suatu benda berkaitan dengan ...', ['massa benda', 'warna benda', 'suhu benda', 'bentuk benda saja'], 0, 'Semakin besar massa, semakin besar kelembaman benda.'),
    soal('Momentum benda bermassa 3 kg yang bergerak 4 m/s adalah ...', ['7 kg m/s', '12 kg m/s', '1,33 kg m/s', '24 kg m/s'], 1, 'Momentum p = mv = 3 × 4 = 12 kg m/s.'),
    soal('Gaya 10 N bekerja selama 0,5 s. Impulsnya ...', ['2 Ns', '10 Ns', '5 Ns', '20 Ns'], 2, 'Impuls I = FΔt = 10 × 0,5 = 5 Ns.'),
    soal('Momentum benda bermassa 2 kg dengan kelajuan 5 m/s adalah ...', ['2,5 kg m/s', '5 kg m/s', '20 kg m/s', '10 kg m/s'], 3, 'p = mv = 2 × 5 = 10 kg m/s.'),
    soal('Gaya 30 N bekerja selama 3 s. Besar impulsnya ...', ['90 Ns', '10 Ns', '33 Ns', '60 Ns'], 0, 'I = FΔt = 30 × 3 = 90 Ns.'),
    soal('Benda berada dalam kesetimbangan translasi jika ...', ['kelajuannya selalu nol', 'jumlah vektor semua gaya nol', 'beratnya nol', 'tidak memiliki massa'], 1, 'Kesetimbangan translasi terjadi ketika resultan gaya sama dengan nol.'),

    // ENERGI DAN USAHA
    soal('Energi kinetik benda bermassa 2 kg dengan kelajuan 4 m/s adalah ...', ['8 J', '12 J', '16 J', '32 J'], 2, 'Eₖ = ½mv² = ½ × 2 × 16 = 16 J.'),
    soal('Energi potensial gravitasi benda 3 kg pada ketinggian 5 m jika g = 10 m/s² adalah ...', ['15 J', '50 J', '100 J', '150 J'], 3, 'Eₚ = mgh = 3 × 10 × 5 = 150 J.'),
    soal('Gaya 20 N memindahkan benda sejauh 5 m searah gaya. Usaha yang dilakukan ...', ['100 J', '25 J', '4 J', '200 J'], 0, 'W = Fs = 20 × 5 = 100 J.'),
    soal('Usaha oleh gaya bernilai nol jika gaya selalu ... terhadap perpindahan.', ['searah', 'tegak lurus', 'membentuk sudut 30°', 'lebih besar dari perpindahan'], 1, 'W = Fs cos θ; jika θ = 90°, cos θ = 0 sehingga usaha nol.'),
    soal('Usaha 600 J dilakukan dalam waktu 10 s. Daya rata-ratanya ...', ['6 W', '30 W', '60 W', '6000 W'], 2, 'P = W/t = 600/10 = 60 W.'),
    soal('Energi mekanik adalah jumlah dari ...', ['massa dan berat', 'gaya dan waktu', 'daya dan usaha', 'energi kinetik dan energi potensial'], 3, 'Energi mekanik merupakan jumlah energi kinetik dan energi potensial.'),
    soal('Mesin menerima energi 500 J dan menghasilkan keluaran berguna 400 J. Efisiensinya ...', ['80%', '20%', '50%', '125%'], 0, 'Efisiensi = (400/500) × 100% = 80%.'),
    soal('Daya 1.000 watt sama dengan ...', ['100 kW', '1 kW', '0,1 kW', '10 kW'], 1, '1 kW = 1.000 W.'),
    soal('Energi potensial gravitasi bertambah jika ...', ['kelajuan berkurang saja', 'massa hilang', 'ketinggian bertambah', 'benda berubah warna'], 2, 'Eₚ = mgh, sehingga energi potensial meningkat ketika ketinggian bertambah.'),
    soal('Sumber energi yang dapat diperbarui adalah ...', ['batu bara', 'minyak bumi', 'gas alam', 'sinar matahari'], 3, 'Energi surya berasal dari matahari dan termasuk sumber energi terbarukan.'),
    soal('Pernyataan hukum kekekalan energi adalah ...', ['energi tidak dapat diciptakan atau dimusnahkan, hanya berubah bentuk', 'energi selalu habis', 'energi hanya berbentuk listrik', 'energi selalu bertambah'], 0, 'Energi total tetap, tetapi dapat berpindah atau berubah bentuk.'),
    soal('Energi kinetik benda bermassa 4 kg dengan kelajuan 3 m/s adalah ...', ['12 J', '18 J', '24 J', '36 J'], 1, 'Eₖ = ½ × 4 × 3² = 18 J.'),
    soal('Gaya 50 N memindahkan benda 2 m searah gaya. Usahanya ...', ['25 J', '52 J', '100 J', '200 J'], 2, 'W = Fs = 50 × 2 = 100 J.'),
    soal('Energi 1.200 J digunakan selama 60 s. Daya yang digunakan ...', ['12 W', '15 W', '120 W', '20 W'], 3, 'P = E/t = 1.200/60 = 20 W.'),
    soal('Benda bermassa 10 kg diangkat setinggi 2 m. Jika g = 10 m/s², usaha minimum ...', ['200 J', '20 J', '100 J', '500 J'], 0, 'Usaha untuk menaikkan benda = mgh = 10 × 10 × 2 = 200 J.'),
    soal('Bahan bakar fosil yang termasuk sumber energi tak terbarukan adalah ...', ['angin', 'batu bara', 'matahari', 'gelombang laut'], 1, 'Batu bara terbentuk sangat lama dan jumlahnya terbatas.'),
    soal('Lampu 100 W menyala selama 5 jam. Energi listrik yang digunakan ...', ['5 kWh', '0,05 kWh', '0,5 kWh', '50 kWh'], 2, 'Energi = 0,1 kW × 5 jam = 0,5 kWh.'),
    soal('Perangkat berdaya 2 kW digunakan selama 3 jam. Energinya ...', ['2 kWh', '3 kWh', '5 kWh', '6 kWh'], 3, 'Energi = daya × waktu = 2 × 3 = 6 kWh.'),
    soal('Energi yang tersimpan pada pegas yang diregangkan disebut ...', ['energi potensial elastis', 'energi nuklir', 'energi bunyi', 'energi kimia'], 0, 'Pegas yang diregangkan atau ditekan menyimpan energi potensial elastis.'),
    soal('Jika kelajuan benda menjadi dua kali semula, energi kinetiknya menjadi ...', ['dua kali', 'empat kali', 'setengah kali', 'delapan kali'], 1, 'Eₖ sebanding dengan v², sehingga penggandaan kelajuan membuat energi menjadi 4 kali.'),
    soal('Satuan SI untuk usaha adalah ...', ['watt', 'newton', 'joule', 'pascal'], 2, 'Usaha dan energi diukur dalam joule (J).'),
    soal('Ketika benda jatuh tanpa hambatan udara, energi potensialnya terutama berubah menjadi ...', ['energi kimia', 'energi listrik', 'energi nuklir', 'energi kinetik'], 3, 'Saat jatuh, energi potensial gravitasi berkurang dan energi kinetik bertambah.'),

    // SUHU DAN KALOR
    soal('Kalor jenis air cair mendekati ...', ['4.200 J/(kg °C)', '420 J/(kg °C)', '42 J/(kg °C)', '42.000 J/(kg °C)'], 0, 'Kalor jenis air sekitar 4.200 J/(kg °C).'),
    soal('Air bermassa 2 kg dipanaskan hingga suhunya naik 5 °C. Jika c = 4.200 J/(kg °C), kalor yang diterima ...', ['21.000 J', '42.000 J', '8.400 J', '84.000 J'], 1, 'Q = mcΔT = 2 × 4.200 × 5 = 42.000 J.'),
    soal('Air 500 g mengalami kenaikan suhu 20 °C. Jika c = 4.200 J/(kg °C), kalor yang diperlukan ...', ['4.200 J', '21.000 J', '42.000 J', '84.000 J'], 2, 'Massa 500 g = 0,5 kg; Q = 0,5 × 4.200 × 20 = 42.000 J.'),
    soal('Suhu 27 °C kira-kira sama dengan ...', ['273 K', '290 K', '310 K', '300 K'], 3, 'Konversi pendekatan K = °C + 273, sehingga 27 + 273 = 300 K.'),
    soal('Suhu 68 °F sama dengan ...', ['20 °C', '30 °C', '15 °C', '25 °C'], 0, '°C = (°F − 32) × 5/9 = (68 − 32) × 5/9 = 20 °C.'),
    soal('Suhu 100 °C sama dengan ...', ['180 °F', '212 °F', '200 °F', '100 °F'], 1, '°F = (9/5 × 100) + 32 = 212 °F.'),
    soal('Kalor untuk meleburkan zat pada suhu tetap dihitung dengan rumus ...', ['Q = mcΔT', 'Q = Pt', 'Q = mL', 'Q = F/A'], 2, 'Pada perubahan wujud tanpa perubahan suhu, kalor laten dihitung Q = mL.'),
    soal('Saat es melebur pada tekanan normal, suhu es yang sedang melebur ...', ['terus naik cepat', 'selalu turun', 'menjadi 100 °C', 'tetap selama proses melebur'], 3, 'Kalor digunakan untuk perubahan wujud, bukan menaikkan suhu selama peleburan berlangsung.'),
    soal('Perpindahan kalor yang dominan pada batang logam adalah ...', ['konduksi', 'konveksi', 'radiasi', 'evaporasi'], 0, 'Konduksi memindahkan kalor melalui kontak antarbagiannya tanpa perpindahan massa keseluruhan.'),
    soal('Perpindahan kalor yang melibatkan aliran zat cair atau gas disebut ...', ['konduksi', 'konveksi', 'radiasi', 'refleksi'], 1, 'Konveksi terjadi melalui gerakan massa fluida.'),
    soal('Kalor matahari dapat sampai ke Bumi terutama melalui ...', ['konduksi', 'konveksi', 'radiasi', 'difusi'], 2, 'Radiasi dapat merambat tanpa medium, termasuk melalui ruang hampa.'),
    soal('Secara spontan, kalor mengalir dari benda ...', ['lebih dingin ke lebih panas', 'bermassa kecil ke besar', 'bervolume besar ke kecil', 'lebih panas ke lebih dingin'], 3, 'Kalor secara spontan berpindah dari suhu lebih tinggi ke suhu lebih rendah.'),
    soal('Dua benda berada dalam kesetimbangan termal jika keduanya memiliki ...', ['suhu sama', 'massa sama', 'volume sama', 'warna sama'], 0, 'Kesetimbangan termal berarti tidak ada aliran kalor bersih karena suhunya sama.'),
    soal('Sebagian besar zat padat ketika dipanaskan akan ...', ['menyusut selalu', 'memuai', 'massanya bertambah', 'berubah menjadi gas langsung'], 1, 'Pemanasan umumnya meningkatkan jarak rata-rata partikel sehingga zat padat memuai.'),
    soal('Pada tekanan 1 atmosfer, air murni membeku pada suhu ...', ['100 °C', '−100 °C', '0 °C', '32 °C'], 2, 'Titik beku air murni pada tekanan normal adalah 0 °C.'),
    soal('Sebanyak 1 kg air menerima kalor 8.400 J. Jika c = 4.200 J/(kg °C), kenaikan suhunya ...', ['0,5 °C', '1 °C', '4 °C', '2 °C'], 3, 'ΔT = Q/(mc) = 8.400/(1 × 4.200) = 2 °C.'),
    soal('Air 100 g dipanaskan dari 20 °C menjadi 30 °C. Kalor yang diterima (c = 4.200 J/(kg °C)) ...', ['4.200 J', '420 J', '42.000 J', '840 J'], 0, 'm = 0,1 kg dan ΔT = 10 °C; Q = 0,1 × 4.200 × 10 = 4.200 J.'),
    soal('Kalor jenis suatu zat adalah kalor yang diperlukan untuk ...', ['meleburkan semua zat', 'menaikkan suhu 1 kg zat sebesar 1 °C', 'menguapkan zat pada suhu berapa pun', 'menaikkan massa zat 1 kg'], 1, 'Kalor jenis menyatakan kalor untuk menaikkan suhu satu kilogram zat sebesar satu derajat.'),
    soal('Titik didih air pada tekanan normal adalah ...', ['0 °C', '50 °C', '100 °C', '212 °C'], 2, 'Pada tekanan 1 atmosfer, air mendidih pada sekitar 100 °C.'),
    soal('Alat untuk mengukur suhu adalah ...', ['barometer', 'amperemeter', 'higrometer', 'termometer'], 3, 'Termometer digunakan untuk mengukur suhu.'),
    soal('Ketika cairan mendidih pada tekanan tetap, kalor yang diberikan terutama digunakan untuk ...', ['mengubah cairan menjadi gas', 'menurunkan massa jenis menjadi nol', 'membuat suhu terus naik selama mendidih', 'mengubah gas menjadi padat'], 0, 'Saat mendidih, kalor laten digunakan untuk mengubah fase cair menjadi gas.'),
    soal('Perbedaan utama kalor dan suhu adalah ...', ['keduanya selalu memiliki satuan sama', 'kalor adalah energi berpindah, suhu menyatakan keadaan termal', 'suhu selalu mengalir dari satu benda ke benda lain', 'kalor diukur dengan termometer saja'], 1, 'Kalor adalah energi yang berpindah akibat perbedaan suhu, sedangkan suhu menunjukkan keadaan termal.'),

    // TEKANAN
    soal('Gaya 100 N bekerja tegak lurus pada luas 2 m². Tekanannya ...', ['25 Pa', '100 Pa', '50 Pa', '200 Pa'], 2, 'P = F/A = 100/2 = 50 Pa.'),
    soal('Gaya 50 N bekerja pada luas 0,01 m². Tekanannya ...', ['500 Pa', '50 Pa', '10.000 Pa', '5.000 Pa'], 3, 'P = F/A = 50/0,01 = 5.000 Pa.'),
    soal('Tekanan hidrostatis air pada kedalaman 3 m (ρ = 1.000 kg/m³, g = 10 m/s²) adalah ...', ['30.000 Pa', '3.000 Pa', '10.000 Pa', '300.000 Pa'], 0, 'P = ρgh = 1.000 × 10 × 3 = 30.000 Pa.'),
    soal('Jika kedalaman titik di dalam cairan homogen menjadi dua kali, tekanan hidrostatisnya menjadi ...', ['setengah', 'dua kali', 'empat kali', 'tetap'], 1, 'Tekanan hidrostatis sebanding dengan kedalaman, jadi jika kedalaman menjadi dua kali, tekanan juga dua kali.'),
    soal('Satuan SI untuk tekanan adalah ...', ['joule', 'newton', 'pascal', 'watt'], 2, 'Tekanan diukur dalam pascal (Pa), setara dengan N/m².'),
    soal('Hukum Pascal menjadi dasar kerja ...', ['termometer', 'lensa cembung', 'dinamo', 'alat hidrolik'], 3, 'Hukum Pascal menyatakan tekanan pada fluida tertutup diteruskan sama besar ke segala arah.'),
    soal('Piston kecil seluas 0,02 m² diberi gaya 100 N. Tekanan fluida yang dihasilkan ...', ['5.000 Pa', '2.000 Pa', '50 Pa', '500 Pa'], 0, 'P = F/A = 100/0,02 = 5.000 Pa.'),
    soal('Gaya ke atas oleh fluida pada benda yang tercelup disebut ...', ['gaya gesek', 'gaya Archimedes', 'gaya sentripetal', 'gaya pegas'], 1, 'Gaya apung atau gaya Archimedes timbul akibat perbedaan tekanan fluida.'),
    soal('Benda cenderung mengapung di dalam cairan jika massa jenis rata-ratanya ...', ['lebih besar dari cairan', 'sama dengan nol', 'lebih kecil dari cairan', 'selalu dua kali cairan'], 2, 'Benda yang massa jenis rata-ratanya lebih kecil dari cairan dapat mengapung.'),
    soal('Pada cairan diam, tekanan hidrostatis pada kedalaman yang sama tidak bergantung pada ...', ['massa jenis cairan', 'gravitasi', 'kedalaman', 'bentuk wadah'], 3, 'Tekanan hidrostatis P = ρgh, sehingga tidak bergantung pada bentuk wadah.'),
    soal('Alat untuk mengukur tekanan atmosfer adalah ...', ['barometer', 'termometer', 'voltmeter', 'neraca'], 0, 'Barometer mengukur tekanan atmosfer.'),
    soal('Piston kecil dan besar memiliki luas 5 cm² dan 100 cm². Jika gaya pada piston kecil 20 N, gaya ideal pada piston besar ...', ['100 N', '400 N', '20 N', '2.000 N'], 1, 'Menurut Pascal, F₂/F₁ = A₂/A₁ = 100/5 = 20; jadi F₂ = 20 × 20 = 400 N.'),
    soal('Gaya 200 N bekerja pada luas 0,5 m². Tekanannya ...', ['100 Pa', '200 Pa', '400 Pa', '800 Pa'], 2, 'P = F/A = 200/0,5 = 400 Pa.'),
    soal('Tekanan hidrostatis air pada kedalaman 5 m (ρ = 1.000 kg/m³, g = 10 m/s²) adalah ...', ['5 kPa', '10 kPa', '100 kPa', '50 kPa'], 3, 'P = ρgh = 1.000 × 10 × 5 = 50.000 Pa = 50 kPa.'),
    soal('Jika gas dalam wadah tertutup dipanaskan pada volume tetap, tekanannya cenderung ...', ['meningkat', 'menurun hingga nol', 'tetap untuk semua kondisi', 'berubah menjadi gaya berat'], 0, 'Pada volume tetap, kenaikan suhu mutlak gas meningkatkan tekanan.'),
    soal('Tekanan hidrostatis pada kedalaman 2 m di minyak bermassa jenis 800 kg/m³, dengan g = 10 m/s², adalah ...', ['8.000 Pa', '16.000 Pa', '20.000 Pa', '32.000 Pa'], 1, 'P = ρgh = 800 × 10 × 2 = 16.000 Pa.'),
    soal('Tekanan dalam zat cair diam bertambah jika ...', ['warna cairan lebih gelap', 'wadah lebih lebar saja', 'kedalaman bertambah', 'permukaan wadah lebih panjang'], 2, 'Tekanan hidrostatis meningkat seiring bertambahnya kedalaman.'),
    soal('Benda tercelup mengalami gaya apung 10 N dan berat 6 N. Resultan gaya vertikalnya ...', ['4 N ke bawah', '6 N ke atas', '10 N ke bawah', '4 N ke atas'], 3, 'Resultan = gaya apung − berat = 10 − 6 = 4 N ke atas.'),
    soal('Tekanan 300 Pa bekerja pada luas 4 m². Gaya yang dihasilkan ...', ['1.200 N', '75 N', '300 N', '1.500 N'], 0, 'F = PA = 300 × 4 = 1.200 N.'),
    soal('Tekanan atmosfer standar di dekat permukaan laut kira-kira ...', ['1.000 Pa', '101.000 Pa', '10.100 Pa', '1.010.000 Pa'], 1, 'Tekanan atmosfer standar sekitar 1,01 × 10⁵ Pa atau 101.000 Pa.'),
    soal('Pisau yang lebih tajam lebih mudah memotong karena memiliki ...', ['gaya berat lebih kecil selalu', 'massa lebih besar selalu', 'luas bidang kontak lebih kecil', 'tekanan lebih kecil'], 2, 'Dengan gaya yang sama, luas kontak lebih kecil menghasilkan tekanan lebih besar.'),
    soal('Jika tekanan pada fluida 2.000 Pa dan luas piston 0,03 m², gaya pada piston adalah ...', ['60 N', '6.000 N', '20 N', '600 N'], 3, 'F = PA = 2.000 × 0,03 = 60 N. '),

    // CAHAYA
    soal('Kelajuan cahaya di ruang hampa kira-kira ...', ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁴ m/s', '3 × 10² m/s'], 0, 'Kelajuan cahaya di ruang hampa sekitar 3 × 10⁸ m/s.'),
    soal('Menurut hukum pemantulan, sudut datang sama dengan ...', ['sudut bias', 'sudut pantul', 'sudut kritis selalu', '90°'], 1, 'Sudut datang sama besar dengan sudut pantul, diukur terhadap garis normal.'),
    soal('Bayangan pada cermin datar bersifat ...', ['nyata dan terbalik', 'nyata dan diperbesar', 'maya, tegak, dan sama besar', 'maya dan selalu terbalik'], 2, 'Cermin datar membentuk bayangan maya, tegak, sama besar, dan berjarak sama di belakang cermin.'),
    soal('Benda berada 2 m di depan cermin datar. Jarak benda ke bayangannya adalah ...', ['1 m', '2 m', '3 m', '4 m'], 3, 'Bayangan berada 2 m di belakang cermin, maka jarak benda ke bayangan = 2 + 2 = 4 m.'),
    soal('Cermin cekung dapat menghasilkan bayangan nyata jika benda berada ...', ['di luar titik fokus', 'tepat di belakang cermin', 'di titik pusat cermin saja', 'di mana pun bayangannya selalu maya'], 0, 'Untuk benda di luar fokus cermin cekung, bayangan yang terbentuk bersifat nyata dan terbalik.'),
    soal('Bayangan yang dibentuk cermin cembung untuk benda nyata umumnya ...', ['nyata dan diperbesar', 'maya, tegak, dan diperkecil', 'nyata dan sama besar', 'terbalik dan diperbesar'], 1, 'Cermin cembung selalu menghasilkan bayangan maya, tegak, dan diperkecil untuk benda nyata.'),
    soal('Pembiasan cahaya terjadi ketika cahaya ...', ['dipantulkan oleh cermin saja', 'berhenti selamanya', 'berubah arah saat memasuki medium berbeda', 'berubah menjadi bunyi'], 2, 'Pembiasan terjadi karena perubahan kelajuan cahaya saat melewati batas dua medium.'),
    soal('Indeks bias medium 1,5. Jika c = 3 × 10⁸ m/s, kelajuan cahaya di medium tersebut ...', ['4,5 × 10⁸ m/s', '3 × 10⁸ m/s', '1,5 × 10⁸ m/s', '2 × 10⁸ m/s'], 3, 'n = c/v, jadi v = c/n = (3 × 10⁸)/1,5 = 2 × 10⁸ m/s.'),
    soal('Hukum Snellius untuk pembiasan menghubungkan indeks bias dengan ...', ['sinus sudut datang dan sudut bias', 'massa dan volume', 'gaya dan percepatan', 'frekuensi dan daya listrik'], 0, 'Hukum Snellius: n₁ sin θ₁ = n₂ sin θ₂.'),
    soal('Lensa cembung yang tipis bersifat ...', ['menyebarkan berkas sejajar', 'mengumpulkan berkas sejajar', 'memantulkan semua cahaya', 'menyerap semua cahaya'], 1, 'Lensa cembung bersifat konvergen, yaitu mengumpulkan berkas sejajar menuju fokus.'),
    soal('Lensa cekung bersifat ...', ['konvergen', 'pemantul', 'divergen', 'pengurai bunyi'], 2, 'Lensa cekung menyebarkan berkas cahaya sejajar sehingga bersifat divergen.'),
    soal('Lensa cembung memiliki fokus 10 cm. Benda diletakkan 30 cm di depan lensa. Jarak bayangan ...', ['5 cm', '10 cm', '20 cm', '15 cm'], 3, '1/f = 1/s + 1/s′, sehingga 1/s′ = 1/10 − 1/30 = 1/15; s′ = 15 cm.'),
    soal('Benda berjarak 30 cm dari lensa dan bayangannya terbentuk 15 cm di sisi lain lensa. Perbesaran mutlaknya ...', ['0,5 kali', '1 kali', '2 kali', '3 kali'], 0, 'Perbesaran mutlak = jarak bayangan/jarak benda = 15/30 = 0,5.'),
    soal('Dalam medium homogen, cahaya merambat ...', ['selalu melingkar', 'lurus', 'hanya ke atas', 'mengikuti aliran udara'], 1, 'Cahaya merambat lurus dalam medium homogen.'),
    soal('Pemantulan internal total dapat terjadi saat cahaya bergerak ...', ['dari udara ke kaca pada sudut apa pun', 'dalam ruang hampa saja', 'dari medium lebih rapat ke lebih renggang dengan sudut datang melebihi sudut kritis', 'dari medium renggang ke lebih rapat selalu'], 2, 'Syaratnya cahaya bergerak dari indeks bias lebih besar ke lebih kecil dan sudut datang melebihi sudut kritis.'),
    soal('Pelangi terbentuk terutama karena cahaya matahari mengalami ...', ['konduksi dan konveksi', 'hamburan bunyi', 'polarisasi listrik saja', 'pembiasan, pemantulan internal, dan dispersi'], 3, 'Tetes air membiaskan, memantulkan secara internal, dan menguraikan cahaya putih menjadi warna-warna.'),
    soal('Cahaya putih dapat diuraikan menjadi berbagai warna melalui ...', ['dispersi', 'interferensi bunyi', 'konduksi', 'induksi listrik'], 0, 'Dispersi memisahkan warna karena tiap panjang gelombang dibiaskan dengan besar berbeda.'),
    soal('Lensa dengan fokus 0,5 m memiliki kekuatan lensa ...', ['0,5 dioptri', '2 dioptri', '5 dioptri', '10 dioptri'], 1, 'Kekuatan lensa P = 1/f dalam meter = 1/0,5 = 2 dioptri.'),
    soal('Cermin cekung memiliki fokus 20 cm. Benda diletakkan 60 cm di depannya. Jarak bayangan ...', ['10 cm', '20 cm', '30 cm', '60 cm'], 2, '1/f = 1/s + 1/s′, sehingga 1/s′ = 1/20 − 1/60 = 1/30; s′ = 30 cm.'),
    soal('Bayangan terbentuk di daerah yang tidak terkena cahaya karena cahaya ...', ['menembus semua benda', 'selalu melengkung', 'berubah menjadi panas saja', 'merambat lurus dan dihalangi benda opak'], 3, 'Benda opak menghalangi cahaya yang merambat lurus sehingga terbentuk bayangan.'),
    soal('Penderita rabun jauh (miopi) umumnya dibantu dengan lensa ...', ['cekung', 'cembung', 'silinder cembung selalu', 'datar'], 0, 'Lensa cekung menyebarkan cahaya agar bayangan benda jauh jatuh tepat di retina.'),
    soal('Jika sudut datang pada cermin datar 35° terhadap garis normal, sudut pantulnya ...', ['55°', '35°', '70°', '90°'], 1, 'Sudut datang sama dengan sudut pantul, sehingga sudut pantul 35°.'),

    // BUNYI
    soal('Gelombang bunyi di udara umumnya merupakan gelombang ...', ['transversal elektromagnetik', 'cahaya', 'longitudinal mekanik', 'stasioner tanpa medium'], 2, 'Bunyi di udara adalah gelombang mekanik longitudinal.'),
    soal('Bunyi tidak dapat merambat melalui ...', ['air', 'baja', 'udara', 'ruang hampa'], 3, 'Bunyi memerlukan medium, sehingga tidak merambat di ruang hampa.'),
    soal('Kelajuan bunyi di udara pada suhu ruang kira-kira ...', ['340 m/s', '3 × 10⁸ m/s', '34 m/s', '3.400 m/s'], 0, 'Kelajuan bunyi di udara pada suhu ruang sekitar 340 m/s.'),
    soal('Bunyi berfrekuensi 200 Hz merambat dengan kelajuan 340 m/s. Panjang gelombangnya ...', ['0,59 m', '1,7 m', '2,0 m', '68 m'], 1, 'λ = v/f = 340/200 = 1,7 m.'),
    soal('Tinggi rendahnya nada terutama ditentukan oleh ...', ['amplitudo', 'jarak sumber', 'frekuensi', 'massa medium saja'], 2, 'Nada lebih tinggi berkaitan dengan frekuensi yang lebih besar.'),
    soal('Kuat lemahnya bunyi terutama berkaitan dengan ...', ['panjang gelombang saja', 'cepat rambat bunyi saja', 'frekuensi saja', 'amplitudo gelombang'], 3, 'Amplitudo yang lebih besar umumnya menghasilkan bunyi yang terdengar lebih kuat.'),
    soal('Rentang frekuensi pendengaran manusia muda pada umumnya sekitar ...', ['20 Hz hingga 20.000 Hz', '0 hingga 10 Hz', '20.000 hingga 100.000 Hz', '1 hingga 100 Hz'], 0, 'Rentang pendengaran manusia umumnya sekitar 20 Hz–20 kHz.'),
    soal('Bunyi dengan frekuensi lebih dari 20.000 Hz disebut ...', ['infrasonik', 'ultrasonik', 'audiosonik rendah', 'resonansi'], 1, 'Ultrasonik memiliki frekuensi di atas sekitar 20 kHz.'),
    soal('Bunyi dengan frekuensi di bawah 20 Hz disebut ...', ['ultrasonik', 'audiosonik', 'infrasonik', 'supersonik'], 2, 'Infrasonik memiliki frekuensi di bawah sekitar 20 Hz.'),
    soal('Gema terdengar 0,4 s setelah bunyi dipancarkan. Jika kelajuan bunyi 340 m/s, jarak pemantul dari sumber ...', ['34 m', '136 m', '170 m', '68 m'], 3, 'Bunyi menempuh perjalanan pulang-pergi, jadi jarak = vt/2 = 340 × 0,4/2 = 68 m.'),
    soal('Frekuensi bunyi 170 Hz dan kelajuannya 340 m/s. Panjang gelombangnya ...', ['2 m', '0,5 m', '1 m', '4 m'], 0, 'λ = v/f = 340/170 = 2 m.'),
    soal('Periode gelombang bunyi dengan frekuensi 500 Hz adalah ...', ['0,2 s', '0,002 s', '0,02 s', '2 s'], 1, 'T = 1/f = 1/500 = 0,002 s.'),
    soal('Sumber bunyi melakukan 20 getaran dalam 4 sekon. Frekuensinya ...', ['4 Hz', '80 Hz', '5 Hz', '16 Hz'], 2, 'f = jumlah getaran/waktu = 20/4 = 5 Hz.'),
    soal('Tingkat intensitas bunyi lazim dinyatakan dalam ...', ['watt', 'pascal', 'hertz', 'desibel'], 3, 'Tingkat intensitas bunyi dinyatakan dalam desibel (dB).'),
    soal('Bunyi dihasilkan oleh benda yang ...', ['bergetar', 'diam sempurna', 'tidak memiliki energi', 'selalu bercahaya'], 0, 'Bunyi berasal dari getaran sumber yang merambat melalui medium.'),
    soal('Secara umum, bunyi merambat paling cepat dalam ...', ['ruang hampa', 'zat padat', 'gas tipis', 'tidak ada medium'], 1, 'Partikel pada zat padat berdekatan sehingga getaran umumnya diteruskan lebih cepat.'),
    soal('Dua sumber bunyi memiliki frekuensi 256 Hz dan 260 Hz. Frekuensi layangannya ...', ['516 Hz', '258 Hz', '4 Hz', '2 Hz'], 2, 'Frekuensi layangan = |260 − 256| = 4 Hz.'),
    soal('Resonansi terjadi ketika frekuensi gaya pemaksa sama dengan ...', ['kecepatan bunyi', 'amplitudo nol', 'panjang gelombang medium', 'frekuensi alami benda'], 3, 'Resonansi terjadi saat frekuensi pemaksa sama atau mendekati frekuensi alami sistem.'),
    soal('Efek Doppler berkaitan dengan perubahan frekuensi teramati akibat ...', ['gerak relatif sumber dan pengamat', 'perubahan massa sumber', 'hilangnya medium', 'perubahan warna sumber'], 0, 'Gerak relatif antara sumber dan pengamat menyebabkan frekuensi yang terdengar berubah.'),
    soal('Saat jarak dari sumber bunyi bertambah, intensitas bunyi yang diterima umumnya ...', ['bertambah terus', 'berkurang', 'selalu tetap', 'menjadi tak terhingga'], 1, 'Energi bunyi menyebar ke area yang lebih luas sehingga intensitas umumnya menurun dengan jarak.'),
    soal('Jika frekuensi gelombang bunyi menjadi dua kali dan kelajuan tetap, panjang gelombangnya ...', ['dua kali', 'empat kali', 'setengahnya', 'tetap'], 2, 'Karena λ = v/f, ketika f menjadi dua kali dengan v tetap, λ menjadi setengah.'),
    soal('Gelombang bunyi pantul kembali setelah 2 s di dalam air. Jika kelajuan bunyi di air 1.500 m/s, jarak objek ...', ['750 m', '1.000 m', '3.000 m', '1.500 m'], 3, 'Jarak = vt/2 = 1.500 × 2/2 = 1.500 m.'),

    // LISTRIK
    soal('Tegangan 12 V diberikan pada resistor 4 Ω. Arus listriknya ...', ['3 A', '4 A', '8 A', '48 A'], 0, 'Hukum Ohm: I = V/R = 12/4 = 3 A.'),
    soal('Arus 2 A mengalir pada resistor 5 Ω. Tegangannya ...', ['2,5 V', '10 V', '7 V', '20 V'], 1, 'V = IR = 2 × 5 = 10 V.'),
    soal('Tiga resistor 2 Ω, 3 Ω, dan 5 Ω disusun seri. Hambatan totalnya ...', ['1 Ω', '8 Ω', '10 Ω', '30 Ω'], 2, 'Dalam rangkaian seri, hambatan dijumlahkan: 2 + 3 + 5 = 10 Ω.'),
    soal('Resistor 6 Ω dan 3 Ω dipasang paralel. Hambatan penggantinya ...', ['9 Ω', '4,5 Ω', '3 Ω', '2 Ω'], 3, '1/R = 1/6 + 1/3 = 3/6, maka R = 2 Ω.'),
    soal('Alat listrik bekerja pada 12 V dan dialiri arus 2 A. Dayanya ...', ['24 W', '6 W', '10 W', '14 W'], 0, 'P = VI = 12 × 2 = 24 W.'),
    soal('Lampu 100 W dipasang pada tegangan 200 V. Arus yang mengalir ...', ['2 A', '0,5 A', '5 A', '20 A'], 1, 'I = P/V = 100/200 = 0,5 A.'),
    soal('Arus 3 A mengalir selama 10 s. Muatan listrik yang berpindah ...', ['3 C', '10 C', '30 C', '300 C'], 2, 'Q = It = 3 × 10 = 30 C.'),
    soal('Satu kilowatt-jam setara dengan ...', ['3.600 J', '36.000 J', '360.000 J', '3,6 × 10⁶ J'], 3, '1 kWh = 1.000 W × 3.600 s = 3,6 × 10⁶ J.'),
    soal('Perangkat berdaya 2 kW digunakan selama 3 jam. Energi listriknya ...', ['6 kWh', '5 kWh', '3 kWh', '0,67 kWh'], 0, 'E = P × t = 2 kW × 3 jam = 6 kWh.'),
    soal('Pada rangkaian seri, besaran yang sama pada setiap komponen adalah ...', ['tegangan', 'arus', 'daya', 'hambatan'], 1, 'Arus yang mengalir pada semua komponen seri sama besar.'),
    soal('Pada rangkaian paralel ideal, besaran yang sama pada setiap cabang adalah ...', ['arus total selalu', 'hambatan', 'tegangan', 'daya'], 2, 'Setiap cabang paralel terhubung pada dua titik yang sama sehingga tegangannya sama.'),
    soal('Arah arus listrik konvensional di luar sumber adalah dari potensial ...', ['rendah ke rendah', 'negatif ke negatif', 'nol ke tak terhingga', 'tinggi ke rendah'], 3, 'Arus konvensional mengalir dari potensial lebih tinggi ke lebih rendah melalui rangkaian luar.'),
    soal('Bahan yang merupakan konduktor listrik yang baik adalah ...', ['tembaga', 'karet', 'kaca kering', 'plastik'], 0, 'Tembaga memiliki banyak elektron bebas sehingga menghantarkan listrik dengan baik.'),
    soal('Bahan yang umumnya merupakan isolator listrik adalah ...', ['aluminium', 'karet', 'tembaga', 'perak'], 1, 'Karet memiliki hambatan listrik besar dan umum digunakan sebagai isolator.'),
    soal('Resistor 4 Ω dihubungkan dengan sumber 8 V. Arus yang mengalir ...', ['0,5 A', '1 A', '2 A', '4 A'], 2, 'I = V/R = 8/4 = 2 A.'),
    soal('Dua resistor masing-masing 4 Ω disusun paralel. Hambatan penggantinya ...', ['8 Ω', '4 Ω', '1 Ω', '2 Ω'], 3, 'Dua hambatan sama besar yang diparalel menghasilkan setengahnya: 4/2 = 2 Ω.'),
    soal('Arus 3 A melalui resistor 2 Ω. Daya yang berubah menjadi kalor pada resistor ...', ['18 W', '6 W', '12 W', '36 W'], 0, 'P = I²R = 3² × 2 = 18 W.'),
    soal('Lampu 60 W menyala selama 5 jam. Energi yang digunakan ...', ['3 kWh', '0,3 kWh', '0,03 kWh', '300 kWh'], 1, 'Energi = 0,06 kW × 5 jam = 0,3 kWh.'),
    soal('Muatan listrik yang mengalir saat arus 1 A selama 1 s adalah ...', ['1 joule', '1 volt', '1 coulomb', '1 ohm'], 2, 'Q = It = 1 A × 1 s = 1 C.'),
    soal('Partikel pembawa muatan negatif dalam atom adalah ...', ['proton', 'neutron', 'inti atom', 'elektron'], 3, 'Elektron memiliki muatan listrik negatif.'),
    soal('Satuan SI untuk beda potensial listrik adalah ...', ['volt', 'ampere', 'ohm', 'watt'], 0, 'Beda potensial listrik diukur dalam volt (V).'),
    soal('Satuan SI untuk hambatan listrik adalah ...', ['coulomb', 'ohm', 'tesla', 'farad'], 1, 'Hambatan listrik diukur dalam ohm (Ω).'),
    soal('Fungsi utama sekering (fuse) dalam rangkaian listrik adalah ...', ['menambah tegangan', 'menyimpan energi', 'memutus rangkaian saat arus berlebihan', 'mengubah arus menjadi cahaya'], 2, 'Sekering meleleh dan memutus rangkaian saat arus melebihi batas aman.'),
  ],
  kimia: [
    // UNSUR, SENYAWA, DAN CAMPURAN
    soal('Manakah yang termasuk unsur kimia?', ['Air murni', 'Oksigen', 'Garam dapur', 'Karbon dioksida'], 1, 'Oksigen tersusun dari satu jenis atom, yaitu atom O.'),
    soal('Zat manakah yang merupakan senyawa?', ['Besi', 'Helium', 'Air (H₂O)', 'Emas'], 2, 'Air tersusun dari unsur hidrogen dan oksigen yang berikatan kimia.'),
    soal('Udara bersih umumnya digolongkan sebagai ....', ['Unsur', 'Senyawa tunggal', 'Campuran homogen', 'Campuran heterogen'], 2, 'Udara merupakan campuran beberapa gas yang tercampur merata.'),
    soal('Campuran pasir dan serbuk besi paling mudah dipisahkan menggunakan ....', ['Kertas saring', 'Magnet', 'Distilasi', 'Kromatografi'], 1, 'Serbuk besi tertarik magnet, sedangkan pasir tidak.'),
    soal('Air garam yang tercampur merata merupakan ....', ['Campuran homogen', 'Campuran heterogen', 'Unsur', 'Senyawa baru'], 0, 'Garam terlarut tersebar merata di dalam air sehingga membentuk larutan homogen.'),
    soal('Campuran minyak dan air termasuk ....', ['Unsur', 'Senyawa', 'Campuran homogen', 'Campuran heterogen'], 3, 'Minyak dan air membentuk dua lapisan sehingga komposisinya tidak seragam.'),
    soal('Kuningan yang tersusun terutama dari tembaga dan seng merupakan ....', ['Unsur', 'Campuran homogen berupa paduan', 'Senyawa kovalen murni', 'Gas'], 1, 'Kuningan adalah paduan logam tembaga dan seng yang digolongkan sebagai campuran homogen.'),
    soal('Rumus kimia karbon dioksida adalah ....', ['CO', 'CO₂', 'C₂O', 'CaO'], 1, 'Satu molekul karbon dioksida mengandung satu atom karbon dan dua atom oksigen.'),
    soal('Belerang (sulfur) murni digolongkan sebagai ....', ['Unsur', 'Senyawa', 'Larutan', 'Koloid'], 0, 'Belerang murni hanya terdiri dari atom unsur sulfur.'),
    soal('Cara yang sesuai untuk memperoleh kristal garam dari air garam adalah ....', ['Pengayakan', 'Pemisahan dengan magnet', 'Penguapan atau kristalisasi', 'Dekantasi minyak'], 2, 'Penguapan menghilangkan air sehingga garam dapat mengkristal.'),
    soal('Pemisahan zat warna dalam tinta dapat dilakukan dengan ....', ['Kromatografi', 'Magnetisasi', 'Pembekuan', 'Penyubliman'], 0, 'Kromatografi memisahkan komponen berdasarkan perbedaan interaksi dengan fase diam dan fase gerak.'),
    soal('Memisahkan pasir dari air paling tepat dilakukan dengan ....', ['Distilasi bertingkat', 'Filtrasi', 'Kromatografi gas', 'Peleburan'], 1, 'Filtrasi menyaring padatan tidak larut seperti pasir dari air.'),
    soal('Untuk memperoleh air tawar dari air laut dengan memanfaatkan perbedaan titik didih digunakan ....', ['Distilasi', 'Pengayakan', 'Pemisahan magnet', 'Sublimasi besi'], 0, 'Pada distilasi, air diuapkan lalu uapnya dikondensasikan, sedangkan garam tertinggal.'),
    soal('Dalam rumus NaCl, perbandingan atom natrium dan klorin adalah ....', ['1 : 1', '1 : 2', '2 : 1', '2 : 3'], 0, 'Satu satuan formula NaCl mengandung satu Na dan satu Cl.'),
    soal('Gas oksigen di udara sebagai O₂ tetap tergolong unsur karena ....', ['Berwujud gas', 'Tersusun hanya dari atom oksigen', 'Selalu bercampur dengan air', 'Tidak memiliki massa'], 1, 'Molekul O₂ memiliki dua atom, tetapi keduanya merupakan atom dari unsur yang sama.'),
    soal('Amonia memiliki rumus NH₃. Amonia tergolong senyawa karena mengandung ....', ['Nitrogen saja', 'Hidrogen saja', 'Nitrogen dan hidrogen yang berikatan', 'Tiga unsur logam'], 2, 'Amonia tersusun dari dua jenis unsur, yaitu nitrogen dan hidrogen.'),
    soal('Lambang kimia unsur natrium adalah ....', ['N', 'Na', 'Ni', 'Ne'], 1, 'Lambang natrium adalah Na.'),
    soal('Ciri utama unsur adalah ....', ['Selalu berbentuk padat', 'Tidak dapat diuraikan menjadi zat lebih sederhana melalui reaksi kimia biasa', 'Selalu larut dalam air', 'Tersusun dari banyak senyawa'], 1, 'Unsur merupakan zat murni yang tidak diuraikan menjadi unsur lain melalui reaksi kimia biasa.'),
    soal('Komposisi suatu campuran ....', ['Selalu tetap', 'Tidak pernah dapat berubah', 'Dapat bervariasi', 'Harus mengikuti rumus kimia tetap'], 2, 'Komponen campuran dapat digabungkan dalam perbandingan yang bervariasi.'),
    soal('Susu sering digolongkan sebagai koloid karena ....', ['Semua komponennya berupa unsur', 'Memiliki partikel terdispersi dalam medium lain', 'Merupakan satu atom', 'Tidak mengandung air'], 1, 'Susu merupakan emulsi, yaitu jenis koloid dengan tetesan lemak terdispersi dalam air.'),
    soal('Metode pemisahan campuran umumnya tidak mengubah ....', ['Jenis unsur menjadi unsur baru', 'Identitas kimia komponen penyusunnya', 'Semua titik didih', 'Jumlah jenis zat menjadi selalu satu'], 1, 'Pemisahan fisika memisahkan komponen tanpa mengubah identitas kimianya.'),
    soal('Paduan perunggu terutama dibuat dari tembaga dan ....', ['Timah', 'Oksigen', 'Klorin', 'Hidrogen'], 0, 'Perunggu secara umum merupakan paduan tembaga dan timah.'),
    soal('Air laut tergolong campuran karena ....', ['Hanya mengandung atom H', 'Mengandung air dan berbagai zat terlarut', 'Memiliki satu rumus kimia untuk seluruh komponen', 'Selalu berupa padatan'], 1, 'Air laut mengandung air, garam, dan berbagai zat lain dengan kadar yang dapat bervariasi.'),
    soal('Garam dapur murni dengan rumus NaCl tergolong ....', ['Unsur', 'Senyawa', 'Campuran heterogen', 'Larutan'], 1, 'NaCl memiliki komposisi kimia tertentu dan tersusun dari natrium serta klorin.'),
    soal('Grafit pada pensil terutama tersusun dari unsur ....', ['Karbon', 'Kalsium', 'Natrium', 'Klorin'], 0, 'Grafit adalah salah satu bentuk alotrop unsur karbon.'),
    soal('Air keran biasanya termasuk campuran karena ....', ['Selalu hanya mengandung H₂O', 'Mengandung mineral atau zat terlarut lain', 'Tidak mengandung molekul', 'Berubah menjadi unsur'], 1, 'Air keran umumnya mengandung zat terlarut selain molekul air.'),
    soal('Air suling murni tergolong senyawa karena ....', ['Mengandung campuran banyak logam', 'Tersusun dari hidrogen dan oksigen dengan komposisi tetap', 'Tidak memiliki rumus kimia', 'Dapat dipisahkan dengan magnet'], 1, 'Air murni memiliki rumus H₂O dengan perbandingan atom tetap.'),
    soal('Campuran serbuk besi dan belerang yang belum dipanaskan dapat dipisahkan dengan magnet karena ....', ['Belerang bersifat magnet kuat', 'Besi tertarik magnet, sedangkan belerang tidak', 'Kedua zat berubah menjadi gas', 'Magnet melarutkan besi'], 1, 'Sebelum bereaksi, besi mempertahankan sifat magnetiknya dan dapat dipisahkan.'),
    soal('Jika besi dan belerang dipanaskan hingga bereaksi, dapat terbentuk zat baru ....', ['FeS', 'Fe₂O₃', 'SO₂ saja', 'H₂S saja'], 0, 'Besi bereaksi dengan belerang membentuk senyawa besi(II) sulfida, FeS.'),
    soal('Kabut termasuk contoh ....', ['Unsur murni', 'Aerosol berupa tetesan cair dalam gas', 'Senyawa logam', 'Larutan padat'], 1, 'Kabut tersusun dari tetesan air kecil yang terdispersi di udara.'),
    soal('Jus jeruk yang masih mengandung banyak ampas umumnya merupakan ....', ['Campuran heterogen', 'Unsur', 'Senyawa murni', 'Atom tunggal'], 0, 'Ampas dan cairan tidak tersebar seragam sehingga campurannya heterogen.'),
    soal('Manakah yang merupakan campuran homogen?', ['Granit', 'Air dan pasir', 'Larutan gula jernih', 'Minyak dan air'], 2, 'Gula yang larut sempurna tersebar merata dalam air.'),
    soal('Dari pilihan berikut, manakah yang bukan senyawa?', ['Amonia (NH₃)', 'Metana (CH₄)', 'Tembaga (Cu)', 'Air (H₂O)'], 2, 'Tembaga adalah unsur yang dilambangkan Cu.'),
    soal('Pemurnian garam dari air laut dengan penguapan memanfaatkan perbedaan ....', ['Sifat magnet', 'Volatilitas atau kemampuan menguap', 'Warna atom', 'Muatan inti'], 1, 'Air mudah menguap, sedangkan garam terlarut tertinggal dan dapat membentuk kristal.'),

    // ATOM
    soal('Nomor atom suatu unsur menyatakan jumlah ....', ['Neutron', 'Proton', 'Proton dan neutron', 'Kulit elektron'], 1, 'Nomor atom sama dengan jumlah proton di dalam inti atom.'),
    soal('Nomor massa atom ditentukan oleh jumlah ....', ['Proton saja', 'Elektron saja', 'Proton dan neutron', 'Neutron dan elektron'], 2, 'Nomor massa adalah jumlah proton dan neutron dalam inti.'),
    soal('Pada atom netral, jumlah proton sama dengan jumlah ....', ['Neutron', 'Elektron', 'Kulit', 'Isotop'], 1, 'Muatan proton dan elektron saling menyeimbangkan pada atom netral.'),
    soal('Atom yang kehilangan satu elektron akan membentuk ....', ['Anion bermuatan −1', 'Kation bermuatan +1', 'Atom tanpa inti', 'Neutron'], 1, 'Kehilangan satu muatan negatif membuat ion bermuatan bersih +1.'),
    soal('Atom yang menerima dua elektron akan membentuk ion bermuatan ....', ['+2', '+1', '−1', '−2'], 3, 'Penambahan dua elektron menambah dua muatan negatif.'),
    soal('Atom natrium-23 memiliki nomor atom 11. Jumlah neutronnya adalah ....', ['11', '12', '23', '34'], 1, 'Jumlah neutron = nomor massa − nomor atom = 23 − 11 = 12.'),
    soal('Atom klorin-35 memiliki nomor atom 17. Jumlah neutronnya adalah ....', ['17', '18', '35', '52'], 1, 'Jumlah neutron = 35 − 17 = 18.'),
    soal('Isotop dari unsur yang sama memiliki ....', ['Jumlah proton sama, neutron berbeda', 'Jumlah neutron sama dan proton berbeda', 'Jumlah elektron selalu berbeda', 'Nomor atom berbeda'], 0, 'Isotop memiliki nomor atom sama tetapi nomor massa berbeda.'),
    soal('Ion Ca²⁺ berasal dari atom kalsium bernomor atom 20. Jumlah elektronnya adalah ....', ['18', '20', '22', '40'], 0, 'Ca²⁺ telah kehilangan dua elektron, jadi elektronnya 20 − 2 = 18.'),
    soal('Jumlah elektron pada ion Mg²⁺ jika nomor atom Mg adalah 12 ialah ....', ['10', '12', '14', '24'], 0, 'Ion Mg²⁺ kehilangan dua elektron: 12 − 2 = 10.'),
    soal('Jumlah elektron ion Al³⁺ jika nomor atom Al adalah 13 ialah ....', ['13', '16', '10', '3'], 2, 'Ion Al³⁺ kehilangan tiga elektron: 13 − 3 = 10.'),
    soal('Jumlah elektron ion O²⁻ jika nomor atom oksigen adalah 8 ialah ....', ['6', '8', '10', '16'], 2, 'Ion O²⁻ menerima dua elektron: 8 + 2 = 10.'),
    soal('Konfigurasi elektron sederhana atom natrium (nomor atom 11) adalah ....', ['2, 8, 1', '2, 7, 2', '2, 8, 8', '2, 9'], 0, 'Sebelas elektron terisi pada kulit secara sederhana sebagai 2, 8, dan 1.'),
    soal('Konfigurasi elektron sederhana atom magnesium (nomor atom 12) adalah ....', ['2, 8, 2', '2, 10', '2, 7, 3', '2, 8, 1'], 0, 'Dua belas elektron menempati kulit dengan susunan 2, 8, 2.'),
    soal('Konfigurasi elektron sederhana atom klorin (nomor atom 17) adalah ....', ['2, 8, 7', '2, 8, 8', '2, 7, 8', '2, 10, 5'], 0, 'Tujuh belas elektron tersusun 2, 8, 7 pada model kulit sederhana.'),
    soal('Elektron valensi adalah elektron yang berada pada ....', ['Inti atom', 'Kulit terluar atom', 'Neutron', 'Proton terdalam'], 1, 'Elektron pada kulit terluar berperan penting dalam pembentukan ikatan kimia.'),
    soal('Unsur dengan nomor atom 8 adalah ....', ['Nitrogen', 'Oksigen', 'Karbon', 'Neon'], 1, 'Nomor atom 8 adalah milik oksigen.'),
    soal('Partikel subatom yang bermuatan positif adalah ....', ['Elektron', 'Neutron', 'Proton', 'Foton'], 2, 'Proton memiliki muatan listrik positif.'),
    soal('Model atom Rutherford menunjukkan bahwa atom memiliki ....', ['Inti kecil bermuatan positif', 'Elektron tanpa inti', 'Inti yang memenuhi seluruh volume atom', 'Tidak ada ruang kosong'], 0, 'Model Rutherford menyimpulkan adanya inti kecil, padat, dan positif serta ruang yang sebagian besar kosong.'),
    soal('Dalam model atom Bohr, elektron digambarkan menempati ....', ['Lintasan atau tingkat energi tertentu', 'Neutron di luar inti', 'Proton yang bergerak bebas di udara', 'Inti tanpa energi'], 0, 'Model Bohr mengenalkan tingkat energi elektron yang terkuantisasi.'),
    soal('Partikel subatom yang bermuatan negatif adalah ....', ['Proton', 'Neutron', 'Elektron', 'Nukleon'], 2, 'Elektron mempunyai muatan relatif −1.'),
    soal('Partikel subatom yang tidak bermuatan listrik adalah ....', ['Proton', 'Neutron', 'Elektron', 'Kation'], 1, 'Neutron bersifat netral secara listrik.'),
    soal('Semua atom dari satu unsur yang sama selalu memiliki jumlah ....', ['Proton yang sama', 'Neutron yang sama', 'Elektron yang selalu sama walau terionisasi', 'Kulit elektron yang sama'], 0, 'Identitas unsur ditentukan oleh jumlah proton atau nomor atom.'),
    soal('Atom karbon-12 memiliki nomor atom 6. Jumlah neutronnya adalah ....', ['6', '12', '18', '4'], 0, 'Jumlah neutron = 12 − 6 = 6.'),
    soal('Atom nitrogen-14 dengan nomor atom 7 memiliki neutron sebanyak ....', ['7', '14', '21', '6'], 0, 'Jumlah neutron = nomor massa 14 − nomor atom 7 = 7.'),
    soal('Atom kalsium-40 memiliki nomor atom 20. Jumlah neutronnya ....', ['10', '20', '40', '60'], 1, 'Jumlah neutron = 40 − 20 = 20.'),
    soal('Unsur yang atomnya memiliki 11 proton adalah ....', ['Natrium', 'Magnesium', 'Aluminium', 'Klorin'], 0, 'Natrium memiliki nomor atom 11, artinya mempunyai 11 proton.'),
    soal('Atom netral tidak memiliki muatan bersih karena ....', ['Tidak memiliki proton', 'Jumlah muatan positif dan negatif sama', 'Neutron bermuatan negatif', 'Elektronnya selalu lebih banyak dari proton'], 1, 'Jumlah proton dan elektron yang sama membuat muatan total nol.'),
    soal('Atom yang kehilangan dua elektron membentuk ion bermuatan ....', ['−2', '−1', '+1', '+2'], 3, 'Kehilangan dua elektron menghasilkan muatan bersih +2.'),
    soal('Lambang ₁₉K menunjukkan bahwa atom kalium memiliki ....', ['19 proton', '19 neutron tepat', '19 proton dan 19 neutron selalu', '19 kulit elektron'], 0, 'Angka subskrip 19 adalah nomor atom, sama dengan jumlah proton.'),
    soal('Ion Na⁺ berasal dari natrium bernomor atom 11. Jumlah elektronnya adalah ....', ['11', '12', '10', '1'], 2, 'Na⁺ kehilangan satu elektron sehingga mempunyai 10 elektron.'),
    soal('Isotop karbon-14 berbeda dari karbon-12 terutama pada jumlah ....', ['Proton', 'Neutron', 'Nomor atom', 'Unsur penyusun'], 1, 'Keduanya memiliki 6 proton, tetapi karbon-14 memiliki 8 neutron dan karbon-12 memiliki 6 neutron.'),
    soal('Kumpulan proton dan neutron di pusat atom disebut ....', ['Kulit', 'Orbital luar', 'Inti atom', 'Ikatan kimia'], 2, 'Inti atom tersusun dari proton dan neutron, kecuali inti hidrogen-1 yang hanya memiliki proton.'),

    // SIFAT DAN PERUBAHAN MATERI
    soal('Contoh sifat fisika suatu zat adalah ....', ['Mudah terbakar', 'Massa jenis', 'Mudah berkarat', 'Bereaksi dengan asam'], 1, 'Massa jenis dapat diukur tanpa mengubah zat menjadi zat lain.'),
    soal('Mudah terbakar merupakan contoh sifat ....', ['Fisika', 'Kimia', 'Geometri', 'Mekanik saja'], 1, 'Kemampuan terbakar menunjukkan kecenderungan zat mengalami reaksi kimia dengan oksigen.'),
    soal('Es mencair menjadi air merupakan perubahan ....', ['Kimia', 'Fisika', 'Nuklir', 'Pembentukan unsur baru'], 1, 'Zat tetap H₂O; yang berubah adalah wujudnya.'),
    soal('Kertas dibakar hingga menjadi abu merupakan perubahan ....', ['Fisika saja', 'Kimia', 'Perubahan bentuk tanpa reaksi', 'Pelarutan'], 1, 'Pembakaran membentuk zat baru seperti abu dan gas.'),
    soal('Pembentukan karat pada besi termasuk perubahan ....', ['Fisika', 'Kimia', 'Wujud saja', 'Pemisahan campuran'], 1, 'Besi bereaksi dengan oksigen dan air sehingga terbentuk senyawa karat.'),
    soal('Gula larut dalam air tanpa mengalami reaksi kimia merupakan ....', ['Perubahan kimia', 'Perubahan fisika', 'Pembakaran', 'Korosi'], 1, 'Molekul gula tetap berupa gula dan dapat dipisahkan kembali, misalnya melalui penguapan air.'),
    soal('Air mendidih lalu menjadi uap termasuk ....', ['Perubahan kimia', 'Perubahan fisika', 'Reaksi pembentukan garam', 'Oksidasi'], 1, 'Pendidihan mengubah wujud air dari cair menjadi gas tanpa mengganti komposisi H₂O.'),
    soal('Fermentasi gula menjadi alkohol oleh mikroorganisme merupakan perubahan ....', ['Fisika', 'Kimia', 'Pelarutan', 'Pemuaian'], 1, 'Fermentasi menghasilkan zat baru, misalnya etanol dan karbon dioksida.'),
    soal('Es kering (CO₂ padat) yang langsung berubah menjadi gas mengalami ....', ['Kondensasi', 'Sublimasi', 'Pembekuan', 'Pengembunan'], 1, 'Sublimasi adalah perubahan wujud dari padat langsung menjadi gas.'),
    soal('Uap air menjadi titik-titik air pada gelas dingin merupakan ....', ['Penguapan', 'Pengembunan', 'Penyubliman', 'Peleburan'], 1, 'Pengembunan mengubah gas menjadi cair.'),
    soal('Rumus untuk menghitung massa jenis adalah ....', ['ρ = m/V', 'ρ = V/m', 'ρ = m × V', 'ρ = m + V'], 0, 'Massa jenis adalah massa dibagi volume.'),
    soal('Sebuah benda bermassa 100 g memiliki volume 20 cm³. Massa jenisnya adalah ....', ['2 g/cm³', '5 g/cm³', '20 g/cm³', '120 g/cm³'], 1, 'Massa jenis = 100 g ÷ 20 cm³ = 5 g/cm³.'),
    soal('Zat padat umumnya memiliki ....', ['Bentuk dan volume tetap', 'Bentuk berubah mengikuti wadah dan volume tetap', 'Bentuk dan volume selalu berubah', 'Partikel berjauhan tanpa tarik-menarik'], 0, 'Partikel zat padat tersusun rapat sehingga bentuk dan volumenya relatif tetap.'),
    soal('Ciri zat cair adalah ....', ['Bentuk dan volume selalu tetap', 'Bentuk mengikuti wadah, volume relatif tetap', 'Mengisi seluruh ruang wadah', 'Tidak memiliki volume'], 1, 'Zat cair mengalir mengikuti bentuk wadah tetapi volumenya relatif tetap.'),
    soal('Gas mengisi seluruh ruang wadah karena partikelnya ....', ['Tersusun tetap dan tidak bergerak', 'Bergerak bebas dan berjauhan', 'Tidak memiliki massa', 'Selalu berikatan kuat seperti padatan'], 1, 'Partikel gas bergerak bebas dan menyebar memenuhi wadah.'),
    soal('Dalam perubahan fisika, yang tetap adalah ....', ['Identitas kimia zat', 'Selalu wujud zat', 'Selalu bentuk zat', 'Jumlah partikel harus bertambah'], 0, 'Perubahan fisika tidak mengubah komposisi kimia zat.'),
    soal('Terbentuknya gelembung gas saat dua larutan bereaksi dapat menjadi tanda ....', ['Reaksi kimia', 'Perubahan bentuk saja', 'Penyaringan', 'Penyubliman'], 0, 'Gas baru yang terbentuk sering menjadi indikasi berlangsungnya reaksi kimia.'),
    soal('Titik leleh zat murni pada tekanan tertentu merupakan sifat ....', ['Fisika', 'Kimia saja', 'Biologis', 'Radioaktif selalu'], 0, 'Titik leleh dapat diukur tanpa mengubah identitas kimia zat.'),
    soal('Penguapan berbeda dari pendidihan karena penguapan dapat terjadi ....', ['Hanya pada titik didih', 'Pada permukaan cairan pada berbagai suhu', 'Hanya di bawah titik beku', 'Hanya pada zat padat'], 1, 'Penguapan terjadi di permukaan cairan dan dapat berlangsung pada berbagai suhu.'),
    soal('Pendidihan cairan terjadi ketika ....', ['Hanya permukaan cairan bergerak', 'Tekanan uap cairan menyamai tekanan luar', 'Cairan berubah menjadi padat', 'Semua molekul berhenti bergerak'], 1, 'Pada titik didih, tekanan uap cairan sama dengan tekanan di sekitarnya.'),
    soal('Rel kereta dapat memuai ketika suhu naik. Pemuaian ini merupakan perubahan ....', ['Kimia', 'Fisika', 'Pembentukan senyawa', 'Pembakaran'], 1, 'Pemuaian mengubah ukuran benda tetapi tidak mengubah komposisi kimianya.'),
    soal('Perak yang menghitam karena bereaksi dengan senyawa sulfur mengalami ....', ['Perubahan fisika', 'Perubahan kimia', 'Pelarutan tanpa reaksi', 'Pengembunan'], 1, 'Lapisan gelap terbentuk akibat reaksi kimia pada permukaan perak.'),
    soal('Kaca yang pecah menjadi serpihan mengalami perubahan ....', ['Kimia', 'Fisika', 'Oksidasi', 'Netralisasi'], 1, 'Kaca berubah ukuran dan bentuk, tetapi komposisi kimianya pada dasarnya tetap.'),
    soal('Pencernaan makanan di dalam tubuh terutama melibatkan ....', ['Perubahan kimia', 'Perubahan wujud saja', 'Pemisahan dengan magnet', 'Pembekuan'], 0, 'Enzim membantu mengubah molekul makanan menjadi zat lain yang lebih sederhana.'),
    soal('Air yang membeku menjadi es merupakan perubahan ....', ['Kimia', 'Fisika', 'Pembakaran', 'Korosi'], 1, 'Air tetap H₂O saat berubah dari cair menjadi padat.'),
    soal('Penyulingan campuran berdasarkan perbedaan titik didih merupakan proses ....', ['Kimia', 'Fisika', 'Nuklir', 'Fermentasi'], 1, 'Distilasi memisahkan komponen dengan penguapan dan pengembunan tanpa reaksi kimia yang diperlukan.'),
    soal('Kemampuan suatu bahan bereaksi dengan oksigen merupakan sifat ....', ['Fisika', 'Kimia', 'Ukuran', 'Warna saja'], 1, 'Reaktivitas dengan oksigen berkaitan dengan perubahan komposisi zat.'),
    soal('Kelarutan gula dalam air termasuk sifat ....', ['Fisika', 'Kimia saja', 'Nuklir', 'Radioaktif'], 0, 'Kelarutan dapat diamati tanpa harus membentuk zat baru.'),
    soal('Daya hantar listrik suatu logam tanpa reaksi kimia merupakan sifat ....', ['Fisika', 'Kimia saja', 'Biologis', 'Tidak dapat diukur'], 0, 'Konduktivitas listrik merupakan sifat fisika bahan.'),
    soal('Perubahan warna saat makanan membusuk biasanya berkaitan dengan ....', ['Perubahan kimia atau proses biologis', 'Perubahan bentuk murni', 'Penyaringan', 'Pembekuan saja'], 0, 'Pembusukan melibatkan reaksi kimia yang dipengaruhi mikroorganisme.'),
    soal('Ketika zat dipanaskan, partikel umumnya ....', ['Berhenti bergerak', 'Memiliki energi kinetik rata-rata lebih tinggi', 'Kehilangan semua energi', 'Berubah menjadi proton'], 1, 'Pemanasan umumnya meningkatkan energi kinetik rata-rata partikel.'),
    soal('Menghancurkan gula batu menjadi butiran kecil merupakan perubahan ....', ['Kimia', 'Fisika', 'Netralisasi', 'Pembentukan zat baru'], 1, 'Yang berubah hanya ukuran dan bentuk gula.'),
    soal('Mengapa massa zat perlu diukur dengan teliti saat melakukan percobaan?', ['Untuk membuktikan semua zat memiliki massa sama', 'Massa merupakan besaran yang dapat digunakan mengukur jumlah materi', 'Massa tidak bergantung pada materi', 'Agar zat berubah menjadi unsur'], 1, 'Massa merupakan ukuran jumlah materi dan penting dalam perhitungan percobaan.'),

    // ASAM DAN BASA
    soal('Larutan asam mengubah kertas lakmus biru menjadi ....', ['Merah', 'Biru tetap', 'Hijau selalu', 'Tidak berwarna'], 0, 'Larutan asam mengubah lakmus biru menjadi merah.'),
    soal('Larutan basa mengubah kertas lakmus merah menjadi ....', ['Merah tetap', 'Biru', 'Kuning selalu', 'Hitam'], 1, 'Larutan basa mengubah lakmus merah menjadi biru.'),
    soal('Larutan dengan pH 3 pada suhu sekitar ruang bersifat ....', ['Asam', 'Netral', 'Basa', 'Tidak memiliki sifat'], 0, 'Nilai pH di bawah 7 menunjukkan sifat asam pada kondisi biasa.'),
    soal('Larutan netral pada suhu 25 °C secara umum memiliki pH ....', ['1', '5', '7', '13'], 2, 'Pada 25 °C, larutan netral memiliki pH sekitar 7.'),
    soal('Larutan dengan pH 11 bersifat ....', ['Asam', 'Netral', 'Basa', 'Selalu berbahaya tanpa melihat konsentrasi'], 2, 'Nilai pH di atas 7 menunjukkan larutan bersifat basa.'),
    soal('Menurut konsep Arrhenius, asam dalam air meningkatkan konsentrasi ....', ['Ion H₃O⁺/H⁺', 'Ion OH⁻ saja', 'Elektron bebas', 'Atom logam'], 0, 'Asam Arrhenius meningkatkan konsentrasi ion hidrogen dalam larutan air.'),
    soal('Manakah yang merupakan contoh basa Arrhenius?', ['HCl', 'H₂SO₄', 'NaOH', 'CH₃COOH'], 2, 'NaOH terurai dalam air menghasilkan ion OH⁻.'),
    soal('Rasa asam pada lemon terutama berasal dari asam ....', ['Sitrat', 'Klorida murni', 'Nitrat pekat', 'Borat'], 0, 'Buah lemon mengandung asam sitrat yang memberi rasa asam.'),
    soal('Asam utama yang terdapat pada cuka adalah ....', ['Asam asetat', 'Asam sulfat', 'Asam nitrat', 'Asam borat'], 0, 'Cuka makanan mengandung asam asetat dalam larutan air.'),
    soal('Larutan sabun biasanya bersifat ....', ['Asam kuat', 'Basa atau agak basa', 'Netral dalam semua keadaan', 'Logam murni'], 1, 'Banyak larutan sabun bersifat basa, meskipun pH produk dapat berbeda.'),
    soal('Asam yang terdapat secara alami dalam lambung untuk membantu pencernaan adalah ....', ['HCl', 'NaOH', 'NaCl', 'CaCO₃'], 0, 'Lambung menghasilkan asam klorida sebagai bagian dari cairan lambung.'),
    soal('Obat antasida bekerja terutama dengan cara ....', ['Menambah asam lambung', 'Menetralkan sebagian asam lambung', 'Mengubah oksigen menjadi hidrogen', 'Menaikkan kadar gula'], 1, 'Antasida mengandung zat yang bereaksi dengan asam sehingga mengurangi keasamannya.'),
    soal('Reaksi asam dengan basa yang menghasilkan garam dan air disebut ....', ['Pembakaran', 'Netralisasi', 'Sublimasi', 'Korosi'], 1, 'Netralisasi adalah reaksi asam-basa yang umumnya menghasilkan garam dan air.'),
    soal('Produk dari reaksi HCl + NaOH → ... adalah ....', ['NaCl + H₂O', 'Na + Cl₂', 'H₂ + O₂', 'Na₂O + HCl'], 0, 'Asam klorida bereaksi dengan natrium hidroksida menghasilkan natrium klorida dan air.'),
    soal('Fenolftalein dalam larutan basa umumnya berwarna ....', ['Merah muda', 'Biru tua', 'Hijau selalu', 'Hitam'], 0, 'Fenolftalein tidak berwarna dalam larutan asam dan berubah merah muda dalam larutan basa.'),
    soal('Indikator universal digunakan untuk memperkirakan ....', ['Massa jenis', 'pH larutan', 'Titik beku logam', 'Nomor atom'], 1, 'Perubahan warna indikator universal dibandingkan dengan skala pH.'),
    soal('Asam bereaksi dengan beberapa karbonat dapat menghasilkan gas ....', ['Oksigen', 'Karbon dioksida', 'Helium', 'Argon'], 1, 'Reaksi asam dengan karbonat umumnya menghasilkan garam, air, dan CO₂.'),
    soal('Reaksi asam dengan logam tertentu yang cukup reaktif dapat menghasilkan gas ....', ['Hidrogen', 'Helium', 'Neon', 'Klorin selalu'], 0, 'Sebagian logam reaktif bereaksi dengan asam menghasilkan garam dan gas hidrogen.'),
    soal('Hujan asam terutama berkaitan dengan pembentukan asam dari oksida ....', ['Sulfur dan nitrogen', 'Helium dan neon', 'Emas dan perak', 'Kalsium dan natrium'], 0, 'Oksida sulfur dan nitrogen di atmosfer dapat bereaksi dengan air membentuk asam.'),
    soal('Asam kuat dalam air umumnya ....', ['Terionisasi hampir sempurna', 'Tidak pernah terionisasi', 'Selalu berupa padatan', 'Tidak dapat menghantarkan listrik'], 0, 'Asam kuat terionisasi hampir sempurna dalam larutan air encer.'),
    soal('Asam asetat dalam cuka digolongkan sebagai asam lemah karena ....', ['Terionisasi sebagian dalam air', 'Selalu tidak larut', 'Tidak mengandung hidrogen', 'Merupakan unsur'], 0, 'Asam lemah hanya terionisasi sebagian dalam air.'),
    soal('Natrium hidroksida (NaOH) dikenal sebagai ....', ['Basa kuat', 'Asam lemah', 'Garam netral selalu', 'Unsur'], 0, 'NaOH merupakan basa kuat yang terurai menjadi ion Na⁺ dan OH⁻ di dalam air.'),
    soal('Menurut konsep Brønsted–Lowry, asam adalah zat yang ....', ['Menerima proton', 'Mendonorkan proton', 'Selalu menghasilkan elektron', 'Tidak dapat bereaksi'], 1, 'Asam Brønsted–Lowry merupakan donor proton (H⁺).'),
    soal('Menurut konsep Brønsted–Lowry, basa adalah zat yang ....', ['Mendonorkan proton', 'Menerima proton', 'Selalu menghasilkan neutron', 'Tidak mengikat ion'], 1, 'Basa Brønsted–Lowry merupakan akseptor proton.'),
    soal('Di antara larutan pH 2 dan pH 5, yang lebih asam adalah ....', ['pH 2', 'pH 5', 'Keduanya netral', 'Tidak dapat dibandingkan'], 0, 'Semakin rendah pH, semakin tinggi konsentrasi ion hidrogen pada skala yang sama.'),
    soal('Jika larutan asam diencerkan dengan air, pH-nya umumnya bergerak ....', ['Menjauhi 7 ke arah lebih kecil', 'Mendekati 7 dari bawah', 'Menjadi selalu 14', 'Tidak mungkin berubah'], 1, 'Pengenceran asam menurunkan konsentrasi ion H₃O⁺ sehingga pH meningkat menuju 7.'),
    soal('Jika larutan basa diencerkan dengan air, pH-nya umumnya bergerak ....', ['Mendekati 7 dari atas', 'Menjauhi 7 ke arah lebih tinggi', 'Menjadi selalu 0', 'Tidak pernah berubah'], 0, 'Pengenceran basa menurunkan konsentrasi OH⁻ sehingga pH menurun menuju 7.'),
    soal('Cara sederhana menguji sifat asam atau basa suatu larutan adalah menggunakan ....', ['Kertas indikator pH', 'Penggaris', 'Magnet', 'Termometer saja'], 0, 'Kertas indikator memberikan perubahan warna yang berkaitan dengan pH.'),
    soal('Kapur pertanian yang mengandung CaCO₃ dapat digunakan untuk membantu mengurangi ....', ['Keasaman tanah', 'Kadar oksigen udara menjadi nol', 'Massa tanah', 'Jumlah proton dalam semua atom'], 0, 'Kalsium karbonat bereaksi dengan keasaman tanah dan dapat menaikkan pH tanah.'),
    soal('Asam yang digunakan sebagai elektrolit pada banyak aki timbal-asam adalah ....', ['Asam sulfat', 'Asam sitrat', 'Asam asetat', 'Asam karbonat'], 0, 'Aki timbal-asam menggunakan larutan asam sulfat sebagai elektrolit.'),
    soal('Air berkarbonasi dapat sedikit bersifat asam karena CO₂ terlarut membentuk ....', ['Asam karbonat', 'Natrium hidroksida', 'Asam sulfat pekat', 'Kalsium oksida'], 0, 'Sebagian CO₂ terlarut bereaksi dengan air membentuk asam karbonat.'),
    soal('Larutan amonia dalam air umumnya bersifat ....', ['Basa', 'Asam kuat', 'Netral selalu', 'Unsur'], 0, 'Amonia bereaksi dengan air sehingga terbentuk ion OH⁻ dalam jumlah tertentu.'),
    soal('Larutan netral memiliki konsentrasi H₃O⁺ dan OH⁻ yang ....', ['Sama pada kondisi netral', 'Selalu sama dengan nol', 'Selalu berbeda seribu kali', 'Tidak dapat dibandingkan'], 0, 'Pada kondisi netral, konsentrasi ion hidronium dan hidroksida sama.'),
    soal('Sifat asam atau basa larutan tidak sebaiknya ditentukan dengan ....', ['Indikator yang sesuai', 'Alat ukur pH', 'Mencicipi larutan kimia yang tidak dikenal', 'Data uji laboratorium'], 2, 'Mencicipi zat kimia tak dikenal berbahaya; gunakan indikator atau alat ukur yang sesuai.'),

    // REAKSI KIMIA SEDERHANA
    soal('Zat-zat sebelum reaksi kimia berlangsung disebut ....', ['Produk', 'Reaktan', 'Katalis saja', 'Endapan saja'], 1, 'Reaktan atau pereaksi adalah zat yang bereaksi pada awal persamaan.'),
    soal('Zat yang terbentuk setelah reaksi disebut ....', ['Reaktan', 'Produk', 'Pelarut saja', 'Indikator saja'], 1, 'Produk adalah zat hasil reaksi kimia.'),
    soal('Persamaan setara untuk pembentukan air dari hidrogen dan oksigen adalah ....', ['H₂ + O₂ → H₂O', '2H₂ + O₂ → 2H₂O', 'H₂ + 2O₂ → H₂O', '2H₂ + 2O₂ → H₂O'], 1, 'Di kedua sisi terdapat empat atom H dan dua atom O.'),
    soal('Persamaan setara pembakaran sempurna metana adalah ....', ['CH₄ + O₂ → CO₂ + H₂O', 'CH₄ + 2O₂ → CO₂ + 2H₂O', '2CH₄ + O₂ → CO₂ + H₂O', 'CH₄ + 3O₂ → CO + 2H₂O'], 1, 'Persamaan setara: satu C, empat H, dan empat O pada masing-masing sisi.'),
    soal('Persamaan setara reaksi magnesium dengan oksigen membentuk magnesium oksida adalah ....', ['Mg + O₂ → MgO', '2Mg + O₂ → 2MgO', 'Mg + 2O₂ → MgO₂', '2Mg + 2O₂ → MgO'], 1, 'Dua atom Mg dan dua atom O terdapat di kedua sisi persamaan.'),
    soal('Pemanasan kalsium karbonat dapat menghasilkan kalsium oksida dan karbon dioksida. Reaksi ini termasuk ....', ['Penguraian', 'Sintesis', 'Netralisasi', 'Polimerisasi saja'], 0, 'Satu senyawa terurai menjadi dua zat yang lebih sederhana.'),
    soal('Reaksi 2Na + Cl₂ → 2NaCl merupakan reaksi ....', ['Penguraian', 'Sintesis atau penggabungan', 'Netralisasi asam-basa', 'Pembekuan'], 1, 'Dua unsur bergabung membentuk satu jenis senyawa.'),
    soal('Dalam reaksi Zn + 2HCl → ZnCl₂ + H₂, gas yang terbentuk adalah ....', ['Oksigen', 'Hidrogen', 'Nitrogen', 'Karbon dioksida'], 1, 'Seng bereaksi dengan asam klorida menghasilkan gas hidrogen.'),
    soal('Ketika larutan AgNO₃ dicampur dengan NaCl, endapan putih AgCl terbentuk. Endapan adalah ....', ['Gas yang keluar', 'Padatan yang terbentuk dari larutan', 'Pelarut', 'Zat yang selalu larut sempurna'], 1, 'Endapan merupakan padatan yang terbentuk dari reaksi dalam larutan.'),
    soal('Fungsi katalis dalam reaksi kimia adalah ....', ['Menaikkan energi aktivasi', 'Mempercepat reaksi dengan menyediakan jalur berenergi aktivasi lebih rendah', 'Selalu menjadi produk utama', 'Mengubah massa total sistem tertutup'], 1, 'Katalis menyediakan jalur reaksi alternatif dengan energi aktivasi lebih rendah dan diregenerasi pada akhir siklus.'),
    soal('Reaksi eksoterm adalah reaksi yang ....', ['Menyerap kalor dari lingkungan', 'Melepaskan energi ke lingkungan, biasanya sebagai kalor', 'Tidak melibatkan energi', 'Selalu membekukan semua zat'], 1, 'Pada reaksi eksoterm, energi dilepaskan ke lingkungan.'),
    soal('Reaksi endoterm adalah reaksi yang ....', ['Menyerap energi dari lingkungan', 'Selalu menghasilkan nyala api', 'Melepaskan semua kalor', 'Tidak memerlukan energi'], 0, 'Reaksi endoterm memerlukan masukan energi dari lingkungan.'),
    soal('Hukum kekekalan massa menyatakan bahwa dalam sistem tertutup, massa total ....', ['Selalu berkurang saat bereaksi', 'Tetap selama reaksi kimia', 'Selalu menjadi dua kali', 'Hanya dimiliki produk'], 1, 'Massa total reaktan sama dengan massa total produk jika seluruh sistem tertutup dihitung.'),
    soal('Persamaan setara pembentukan hidrogen klorida dari H₂ dan Cl₂ adalah ....', ['H₂ + Cl₂ → 2HCl', 'H₂ + Cl₂ → HCl', '2H₂ + Cl₂ → HCl', 'H₂ + 2Cl₂ → 2HCl'], 0, 'Persamaan H₂ + Cl₂ → 2HCl memiliki dua atom H dan dua atom Cl pada kedua sisi.'),
    soal('Persamaan setara pembentukan amonia dari nitrogen dan hidrogen adalah ....', ['N₂ + H₂ → NH₃', 'N₂ + 3H₂ → 2NH₃', 'N₂ + 2H₂ → 2NH₃', '2N₂ + H₂ → NH₃'], 1, 'Di kedua sisi terdapat dua atom N dan enam atom H.'),
    soal('Reaksi Fe + S → FeS merupakan contoh reaksi ....', ['Sintesis', 'Penguraian', 'Netralisasi', 'Pengendapan saja'], 0, 'Besi dan belerang bergabung membentuk senyawa besi sulfida.'),
    soal('Fotosintesis mengubah karbon dioksida dan air menjadi glukosa dan oksigen dengan bantuan ....', ['Cahaya', 'Magnet', 'Garam dapur saja', 'Tekanan vakum saja'], 0, 'Energi cahaya digunakan dalam proses fotosintesis.'),
    soal('Reaksi netralisasi umumnya berlangsung antara ....', ['Asam dan basa', 'Dua gas mulia', 'Dua unsur inert saja', 'Dua logam tanpa reaksi'], 0, 'Reaksi asam-basa menghasilkan garam dan biasanya air.'),
    soal('Menaikkan suhu umumnya mempercepat laju reaksi karena partikel ....', ['Bergerak lebih lambat', 'Memiliki energi kinetik rata-rata lebih tinggi dan lebih sering bertumbukan efektif', 'Berhenti bertumbukan', 'Menghilang'], 1, 'Pada suhu lebih tinggi, lebih banyak tumbukan memiliki energi yang cukup untuk bereaksi.'),
    soal('Memperbesar luas permukaan padatan biasanya mempercepat reaksi karena ....', ['Jumlah bagian yang dapat berkontak meningkat', 'Massa atomnya hilang', 'Semua ikatan pasti tidak ada', 'Suhu selalu turun menjadi nol'], 0, 'Serbuk halus memiliki area kontak lebih besar daripada bongkahan dengan massa sama.'),
    soal('Menaikkan konsentrasi reaktan dalam larutan biasanya ....', ['Mengurangi frekuensi tumbukan', 'Meningkatkan peluang tumbukan antarpartikel', 'Menghilangkan semua produk', 'Mengubah unsur menjadi isotop'], 1, 'Konsentrasi lebih tinggi berarti lebih banyak partikel per volume dan peluang tumbukan meningkat.'),
    soal('Enzim dalam reaksi biologis berperan sebagai ....', ['Katalis', 'Reaktan yang selalu habis seluruhnya', 'Produk akhir saja', 'Pelarut anorganik selalu'], 0, 'Enzim mempercepat reaksi biologis dengan menurunkan energi aktivasi.'),
    soal('Dalam pengertian dasar, oksidasi sering dikaitkan dengan ....', ['Penambahan oksigen atau pelepasan elektron', 'Penambahan neutron', 'Penghilangan inti atom', 'Pelelehan saja'], 0, 'Oksidasi dapat didefinisikan sebagai penambahan oksigen atau kehilangan elektron.'),
    soal('Dalam konsep redoks, reduksi berarti ....', ['Pelepasan elektron', 'Penerimaan elektron', 'Selalu penambahan oksigen', 'Pembentukan gelombang'], 1, 'Reduksi adalah proses penerimaan elektron.'),
    soal('Pembakaran pada umumnya merupakan reaksi dengan ....', ['Oksigen atau pengoksidasi', 'Helium saja', 'Air murni saja', 'Emas saja'], 0, 'Pembakaran biasa melibatkan reaksi cepat dengan oksigen dan melepaskan energi.'),
    soal('Fermentasi ragi pada adonan dapat menghasilkan gas ....', ['Karbon dioksida', 'Helium', 'Argon', 'Neon'], 0, 'Ragi memfermentasi gula dan menghasilkan karbon dioksida yang membantu adonan mengembang.'),
    soal('Persamaan setara penguraian hidrogen peroksida adalah ....', ['H₂O₂ → H₂ + O₂', '2H₂O₂ → 2H₂O + O₂', 'H₂O₂ → H₂O₂ + O₂', 'H₂O₂ + O₂ → H₂O'], 1, 'Persamaan 2H₂O₂ → 2H₂O + O₂ seimbang untuk atom H dan O.'),
    soal('Pada reaksi Zn + CuSO₄ → ZnSO₄ + Cu, seng ....', ['Menggantikan tembaga dari senyawanya', 'Menjadi gas mulia', 'Tidak mengalami perubahan apa pun', 'Mengubah sulfat menjadi oksigen'], 0, 'Seng lebih reaktif daripada tembaga sehingga dapat menggantikannya dari larutan tembaga(II) sulfat.'),
    soal('Persamaan setara penguraian kalium klorat adalah ....', ['KClO₃ → KCl + O₂', '2KClO₃ → 2KCl + 3O₂', 'KClO₃ → 2KCl + O₂', 'K₂ClO₃ → KCl + 3O₂'], 1, 'Persamaan 2KClO₃ → 2KCl + 3O₂ menyeimbangkan K, Cl, dan O.'),
    soal('Persamaan setara pembentukan besi(III) oksida dari besi dan oksigen adalah ....', ['Fe + O₂ → Fe₂O₃', '4Fe + 3O₂ → 2Fe₂O₃', '2Fe + O₂ → Fe₂O₃', 'Fe + 3O₂ → FeO₃'], 1, 'Persamaan 4Fe + 3O₂ → 2Fe₂O₃ seimbang untuk Fe dan O.'),
    soal('Perubahan suhu atau terbentuknya endapan saat pencampuran dapat menjadi petunjuk ....', ['Terjadinya reaksi kimia', 'Jumlah atom selalu bertambah', 'Zat berubah menjadi unsur baru tanpa reaksi', 'Tidak ada interaksi antarzat'], 0, 'Perubahan suhu dan terbentuknya endapan dapat menjadi tanda reaksi, meski perlu dilihat bersama bukti lainnya.'),
    soal('Reaksi CaO + H₂O → Ca(OH)₂ dikenal melepaskan kalor. Reaksi ini bersifat ....', ['Eksoterm', 'Endoterm', 'Tidak memiliki perubahan energi', 'Hanya perubahan wujud'], 0, 'Pembentukan kalsium hidroksida dari kapur tohor dan air melepaskan kalor.'),
    soal('Respirasi sel menggunakan glukosa dan oksigen serta menghasilkan antara lain ....', ['Karbon dioksida dan air', 'Natrium dan klorin', 'Helium dan emas', 'Besi dan belerang'], 0, 'Respirasi aerob mengoksidasi glukosa dan menghasilkan karbon dioksida, air, serta energi.'),

    // ZAT KIMIA DALAM KEHIDUPAN SEHARI-HARI
    soal('Rumus kimia utama garam dapur adalah ....', ['NaCl', 'NaOH', 'HCl', 'Na₂CO₃'], 0, 'Garam dapur terutama tersusun dari natrium klorida (NaCl).'),
    soal('Soda kue yang digunakan dalam adonan kue memiliki rumus ....', ['NaHCO₃', 'NaCl', 'H₂SO₄', 'CaO'], 0, 'Soda kue atau natrium bikarbonat memiliki rumus NaHCO₃.'),
    soal('Zat yang memberikan rasa asam pada cuka makanan adalah ....', ['Asam asetat', 'Natrium hidroksida', 'Kalsium oksida', 'Amonia'], 0, 'Cuka mengandung asam asetat yang diencerkan dalam air.'),
    soal('Bahan aktif yang umum terdapat pada pemutih pakaian rumah tangga berbasis klorin adalah ....', ['Natrium hipoklorit', 'Natrium klorida saja', 'Glukosa', 'Kalsium karbonat'], 0, 'Banyak pemutih klorin mengandung natrium hipoklorit (NaClO).'),
    soal('Alkohol pada sebagian cairan pembersih tangan berfungsi terutama sebagai ....', ['Antiseptik yang membantu mengurangi mikroorganisme', 'Pewarna makanan', 'Pupuk tanaman', 'Pengganti semua cara kebersihan'], 0, 'Etanol atau isopropanol digunakan pada produk pembersih tangan tertentu; produk perlu digunakan sesuai petunjuk label.'),
    soal('Zat dalam pasta gigi yang membantu melindungi enamel gigi dari karies adalah senyawa ....', ['Fluorida', 'Bensin', 'Karbon monoksida', 'Amonia pekat'], 0, 'Fluorida membantu memperkuat enamel dan meningkatkan ketahanan terhadap asam.'),
    soal('Sabun dan deterjen membantu membersihkan minyak karena mengandung zat ....', ['Surfaktan', 'Radioaktif', 'Gas mulia', 'Logam cair'], 0, 'Surfaktan membantu air membasahi permukaan serta mengangkat minyak dan kotoran.'),
    soal('Asam sitrat banyak ditemukan dalam buah jeruk dan juga digunakan sebagai ....', ['Pengatur keasaman makanan', 'Bahan bakar utama pesawat', 'Logam konstruksi', 'Gas untuk balon'], 0, 'Asam sitrat memberi rasa asam dan digunakan sebagai pengatur keasaman pada sejumlah produk pangan.'),
    soal('Natrium benzoat digunakan pada sejumlah produk makanan sebagai ....', ['Pengawet', 'Pemanis alami utama', 'Bahan pembentuk logam', 'Pupuk fosfat'], 0, 'Natrium benzoat dapat menghambat pertumbuhan mikroorganisme pada pangan tertentu bila digunakan sesuai ketentuan.'),
    soal('Monosodium glutamat (MSG) dikenal sebagai bahan tambahan yang berfungsi sebagai ....', ['Penguat rasa umami', 'Pemutih pakaian', 'Penyerap air untuk sepatu', 'Bahan pengoksidasi kolam'], 0, 'MSG digunakan untuk memperkuat rasa gurih atau umami.'),
    soal('Glukosa merupakan zat yang berperan penting sebagai ....', ['Sumber energi bagi sel', 'Logam penghantar', 'Bahan utama kaca', 'Gas pemadam kebakaran'], 0, 'Sel menggunakan glukosa dalam proses metabolisme untuk memperoleh energi.'),
    soal('Gula pasir rumah tangga terutama mengandung ....', ['Sukrosa', 'Natrium klorida', 'Asam sulfat', 'Kalsium hidroksida'], 0, 'Gula pasir umumnya mengandung sukrosa.'),
    soal('Gas yang dilarutkan dalam minuman berkarbonasi untuk menghasilkan gelembung adalah ....', ['Karbon dioksida', 'Karbon monoksida', 'Hidrogen sulfida', 'Klorin'], 0, 'Karbon dioksida terlarut membentuk gelembung ketika tekanan dilepaskan.'),
    soal('Komponen utama LPG rumah tangga umumnya berupa campuran ....', ['Propana dan butana', 'Oksigen dan nitrogen', 'Karbon dioksida dan helium', 'Klorin dan hidrogen'], 0, 'LPG biasanya terdiri terutama dari propana, butana, atau campuran keduanya.'),
    soal('Urea pada pupuk menyediakan unsur hara utama berupa ....', ['Nitrogen', 'Emas', 'Helium', 'Klorin murni'], 0, 'Urea memiliki rumus CO(NH₂)₂ dan merupakan sumber nitrogen bagi tanaman.'),
    soal('Pupuk NPK memasok tiga unsur hara utama, yaitu ....', ['Nitrogen, fosfor, dan kalium', 'Natrium, polonium, dan karbon', 'Neon, fosfor, dan kalsium', 'Nikel, platinum, dan kalium'], 0, 'NPK merujuk pada nitrogen (N), fosfor (P), dan kalium (K).'),
    soal('Magnesium hidroksida pada beberapa antasida berfungsi sebagai ....', ['Basa yang menetralkan sebagian asam lambung', 'Asam yang menaikkan keasaman', 'Pewarna pakaian', 'Gas untuk minuman bersoda'], 0, 'Mg(OH)₂ adalah basa yang bereaksi dengan asam lambung.'),
    soal('Karbon aktif digunakan pada beberapa filter karena mampu ....', ['Mengadsorpsi sejumlah zat pada permukaannya', 'Mengubah semua zat menjadi oksigen', 'Membuat air selalu steril tanpa proses lain', 'Menarik semua logam dengan magnet'], 0, 'Karbon aktif memiliki permukaan luas untuk mengadsorpsi zat tertentu; efektivitasnya bergantung pada desain filter.'),
    soal('Silika gel dalam kemasan barang sering digunakan untuk ....', ['Menyerap kelembapan', 'Memberi rasa manis', 'Menghasilkan bahan bakar', 'Mengubah plastik menjadi logam'], 0, 'Silika gel adalah bahan pengering yang mengadsorpsi uap air.'),
    soal('Natrium hidroksida pada produk pembersih saluran tertentu perlu ditangani dengan hati-hati karena bersifat ....', ['Korosif', 'Selalu aman diminum', 'Tidak bereaksi dengan jaringan', 'Gas mulia'], 0, 'NaOH adalah basa kaustik yang dapat menyebabkan luka; ikuti label dan jangan dicampur sembarangan.'),
    soal('Mengapa produk pembersih berbahan pemutih tidak boleh dicampur sembarangan dengan pembersih lain?', ['Dapat terjadi reaksi yang menghasilkan gas berbahaya', 'Semua campuran menjadi air murni', 'Agar pH selalu tepat 7', 'Karena tidak ada bahan kimia di dalamnya'], 0, 'Pemutih dapat bereaksi dengan beberapa bahan lain dan melepaskan gas berbahaya; gunakan terpisah sesuai label.'),
    soal('Kapur tohor memiliki rumus kimia ....', ['CaO', 'CaCO₃', 'CaCl₂', 'CO₂'], 0, 'Kapur tohor adalah kalsium oksida (CaO).'),
    soal('Tawas digunakan dalam pengolahan air terutama untuk membantu ....', ['Menggumpalkan partikel halus agar mudah dipisahkan', 'Menambah kadar gula', 'Mengubah air menjadi bensin', 'Menghilangkan semua zat terlarut tanpa proses lain'], 0, 'Tawas membantu koagulasi partikel tersuspensi sehingga lebih mudah mengendap atau disaring.'),
    soal('Yodium yang ditambahkan pada garam beryodium berperan sebagai ....', ['Mikronutrien untuk fungsi tiroid', 'Bahan bakar', 'Pengganti air', 'Pemanis'], 0, 'Yodium dibutuhkan tubuh dalam jumlah kecil untuk membentuk hormon tiroid.'),
    soal('Gas karbon monoksida (CO) berbahaya karena ....', ['Mengganggu pengangkutan oksigen oleh hemoglobin', 'Selalu berbau tajam sehingga mudah terdeteksi', 'Merupakan nutrisi utama', 'Tidak dapat masuk ke tubuh'], 0, 'CO berikatan kuat dengan hemoglobin dan dapat menyebabkan kekurangan oksigen; gas ini tidak berwarna dan tidak berbau.'),
    soal('Karbon dioksida digunakan pada beberapa alat pemadam api karena ....', ['Dapat membantu mengurangi kontak api dengan oksigen', 'Mudah terbakar sebagai bahan bakar', 'Menghasilkan oksigen dalam jumlah besar', 'Selalu mendinginkan semua benda sampai beku'], 0, 'CO₂ dapat memadamkan jenis kebakaran tertentu dengan mengurangi ketersediaan oksigen di sekitar api.'),
    soal('Aseton banyak digunakan sebagai ....', ['Pelarut, misalnya pada penghapus cat kuku', 'Pupuk nitrogen utama', 'Garam mineral makanan', 'Gas mulia'], 0, 'Aseton adalah pelarut organik yang mudah menguap dan mudah terbakar.'),
    soal('Parasetamol pada obat tertentu digunakan untuk membantu meredakan ....', ['Nyeri dan demam', 'Kekurangan oksigen akibat CO', 'Semua jenis infeksi bakteri secara langsung', 'Kerusakan semua jaringan'], 0, 'Parasetamol adalah obat pereda nyeri dan penurun demam; penggunaan harus mengikuti petunjuk label atau tenaga kesehatan.'),
    soal('Kalsium karbonat (CaCO₃) ditemukan antara lain pada ....', ['Batu kapur dan cangkang tertentu', 'Gas LPG', 'Udara murni', 'Alkohol'], 0, 'Kalsium karbonat merupakan komponen utama batu kapur, kapur tulis, dan banyak cangkang organisme.'),
    soal('Oksigen medis digunakan karena dibutuhkan tubuh untuk ....', ['Mendukung proses respirasi', 'Menggantikan semua nutrisi', 'Menetralkan asam lambung secara langsung', 'Membuat darah tidak mengandung air'], 0, 'Oksigen diperlukan dalam respirasi sel, dan terapi oksigen digunakan sesuai penilaian medis.'),
    soal('Polietilena (PE) banyak digunakan untuk membuat ....', ['Kantong dan kemasan plastik', 'Larutan asam lambung', 'Garam dapur', 'Pupuk urea murni'], 0, 'Polietilena adalah polimer yang umum digunakan dalam berbagai produk plastik.'),
    soal('Hidrogen peroksida memiliki rumus kimia ....', ['H₂O₂', 'H₂O', 'HOCl', 'NaOH'], 0, 'Hidrogen peroksida memiliki dua atom hidrogen dan dua atom oksigen per molekul.'),
    soal('Amonia digunakan dalam sejumlah produk pembersih, tetapi tidak boleh dicampur sembarangan dengan pemutih karena ....', ['Dapat menghasilkan senyawa atau gas berbahaya', 'Akan berubah menjadi oksigen murni', 'Selalu membentuk garam dapur yang aman', 'Menghilangkan semua risiko'], 0, 'Pencampuran amonia dan pemutih berbasis klorin dapat menghasilkan zat berbahaya; gunakan produk sesuai petunjuk.'),
  ],

  biologi: [
    soal("Organel sel yang menghasilkan sebagian besar ATP melalui respirasi sel adalah ...", ["Ribosom", "Badan Golgi", "Mitokondria", "Lisosom"], 2, "Mitokondria menjadi tempat utama respirasi aerob dan menghasilkan sebagian besar ATP sel."),
    soal("Tempat utama sintesis protein di dalam sel adalah ...", ["Ribosom", "Vakuola", "Sentriol", "Lisosom"], 0, "Ribosom menerjemahkan informasi mRNA menjadi rantai polipeptida atau protein."),
    soal("Organel yang menyimpan sebagian besar DNA dan mengendalikan aktivitas sel eukariotik adalah ...", ["Nukleus", "Badan Golgi", "Peroksisom", "Vakuola"], 0, "Nukleus menyimpan sebagian besar materi genetik dan mengatur ekspresi gen."),
    soal("Fungsi utama membran plasma adalah ...", ["Menghasilkan seluruh energi sel", "Mengatur keluar-masuknya zat", "Membentuk dinding sel tumbuhan", "Menyimpan semua DNA"], 1, "Membran plasma bersifat selektif permeabel sehingga mengatur pertukaran zat dengan lingkungan."),
    soal("Dinding sel tumbuhan terutama tersusun atas ...", ["Kitin", "Glikogen", "Selulosa", "Peptidoglikan"], 2, "Selulosa merupakan komponen struktural utama dinding sel tumbuhan."),
    soal("Fotosintesis pada sel tumbuhan berlangsung di ...", ["Mitokondria", "Lisosom", "Ribosom", "Kloroplas"], 3, "Kloroplas mengandung klorofil dan menjadi tempat berlangsungnya fotosintesis."),
    soal("Ciri utama sel prokariotik adalah ...", ["Tidak memiliki membran inti", "Memiliki banyak organel bermembran", "Selalu memiliki kloroplas", "Memiliki inti sejati"], 0, "Sel prokariotik, seperti bakteri, tidak mempunyai inti yang dibatasi membran."),
    soal("Pada osmosis, air bergerak melalui membran semipermeabel dari larutan yang ...", ["Berkonsentrasi zat terlarut lebih tinggi ke lebih rendah", "Berkonsentrasi zat terlarut lebih rendah ke lebih tinggi", "Selalu bersuhu rendah ke tinggi", "Tidak mengandung air ke larutan jenuh"], 1, "Air secara netto bergerak dari potensial air lebih tinggi (larutan lebih encer) menuju potensial air lebih rendah."),
    soal("Transport aktif melintasi membran sel membutuhkan ...", ["Energi", "Cahaya matahari secara langsung", "Klorofil", "Dinding sel"], 0, "Transport aktif memindahkan zat melawan gradien konsentrasi dan memerlukan energi, umumnya ATP."),
    soal("Pada sel eukariotik, sebagian besar DNA berada di ...", ["Membran plasma", "Nukleus", "Badan Golgi", "Dinding sel"], 1, "Sebagian besar DNA sel eukariotik tersimpan di nukleus, meskipun mitokondria dan kloroplas juga memiliki DNA sendiri."),
    soal("Organel yang memodifikasi, mengemas, dan mendistribusikan protein adalah ...", ["Sentriol", "Nukleolus", "Vakuola", "Badan Golgi"], 3, "Badan Golgi memproses dan mengemas protein atau lipid ke dalam vesikel."),
    soal("Lisosom berfungsi terutama untuk ...", ["Fotosintesis", "Pencernaan intraseluler", "Sintesis DNA", "Menyusun dinding sel"], 1, "Lisosom mengandung enzim hidrolitik untuk menguraikan bahan di dalam sel."),
    soal("Difusi sederhana terjadi ketika partikel bergerak netto dari daerah ...", ["Konsentrasi tinggi ke konsentrasi rendah", "Konsentrasi rendah ke konsentrasi tinggi tanpa energi", "Tekanan selalu rendah ke tinggi", "Bersuhu rendah ke tinggi saja"], 0, "Difusi mengikuti gradien konsentrasi dan tidak secara langsung membutuhkan ATP."),
    soal("Retikulum endoplasma kasar tampak berbintik karena ditempeli ...", ["Lisosom", "Kloroplas", "Ribosom", "Sentriol"], 2, "Ribosom yang menempel membuat permukaan retikulum endoplasma terlihat kasar dan berperan dalam sintesis protein."),
    soal("Struktur yang dimiliki sel tumbuhan tetapi umumnya tidak dimiliki sel hewan adalah ...", ["Membran plasma", "Sitoplasma", "Ribosom", "Dinding sel"], 3, "Sel tumbuhan memiliki dinding sel, sedangkan sel hewan tidak memilikinya."),
    soal("Jika sel ditempatkan dalam larutan isotonik, maka ...", ["Air hanya masuk ke sel", "Tidak ada perpindahan air netto", "Sel selalu pecah", "Air hanya keluar dari sel"], 1, "Dalam larutan isotonik, laju air masuk dan keluar seimbang sehingga tidak terjadi perpindahan air netto."),
    soal("Sel disebut unit struktural dan fungsional makhluk hidup karena ...", ["Semua sel selalu terlihat tanpa mikroskop", "Sel hanya berfungsi menyimpan air", "Struktur dan proses kehidupan berlangsung pada tingkat sel", "Sel tidak memerlukan energi"], 2, "Sel merupakan unit dasar penyusun tubuh dan tempat berlangsungnya berbagai proses kehidupan."),
    soal("Bakteri umumnya berkembang biak dengan cara ...", ["Pembelahan biner", "Penyerbukan", "Pembentukan biji", "Fragmentasi jaringan pembuluh"], 0, "Bakteri umumnya memperbanyak diri melalui pembelahan biner menjadi dua sel anak."),
    soal("Plasmolisis pada sel tumbuhan dapat terjadi ketika sel berada dalam larutan ...", ["Hipotonik", "Isotonik", "Murni tanpa zat terlarut saja", "Hipertonik"], 3, "Dalam larutan hipertonik, air keluar dari sel sehingga membran plasma menjauh dari dinding sel."),
    soal("Nukleolus berperan penting dalam pembentukan ...", ["Lipid membran", "ATP di sitoplasma", "Komponen ribosom", "Selulosa"], 2, "Nukleolus merupakan tempat pembentukan rRNA dan perakitan awal subunit ribosom."),

    // ORGAN TUBUH MANUSIA — 20 soal
    soal("Organ yang berperan utama menyaring darah dan membentuk urine adalah ...", ["Paru-paru", "Ginjal", "Lambung", "Pankreas"], 1, "Ginjal menyaring darah di nefron dan menghasilkan urine untuk membuang sisa metabolisme."),
    soal("Organ yang menghasilkan empedu untuk membantu pencernaan lemak adalah ...", ["Hati", "Jantung", "Kandung kemih", "Limpa"], 0, "Hati memproduksi empedu; cairan ini membantu mengemulsikan lemak di usus halus."),
    soal("Hormon insulin diproduksi oleh bagian pankreas yang disebut ...", ["Nefron", "Alveolus", "Pulau Langerhans", "Vili"], 2, "Sel beta pada pulau Langerhans pankreas menghasilkan insulin untuk membantu menurunkan kadar glukosa darah."),
    soal("Pusat koordinasi gerak sadar, berpikir, dan ingatan terutama terdapat pada ...", ["Sumsum tulang", "Lambung", "Usus besar", "Otak besar"], 3, "Otak besar atau serebrum terlibat dalam fungsi kognitif dan gerak sadar."),
    soal("Organ terbesar pada tubuh manusia yang juga membantu mengatur suhu adalah ...", ["Pankreas", "Kulit", "Tiroid", "Limpa"], 1, "Kulit merupakan organ terbesar dan membantu termoregulasi melalui keringat serta perubahan aliran darah kulit."),
    soal("Hormon tiroksin dihasilkan oleh kelenjar ...", ["Tiroid", "Adrenal", "Pineal", "Timus"], 0, "Kelenjar tiroid menghasilkan hormon tiroksin yang berperan mengatur laju metabolisme."),
    soal("Sel darah merah terutama dibentuk pada orang dewasa di ...", ["Kandung empedu", "Korteks otak", "Sumsum tulang merah", "Pankreas"], 2, "Sumsum tulang merah merupakan lokasi utama pembentukan sel-sel darah pada orang dewasa."),
    soal("Organ yang menyimpan urine sebelum dikeluarkan adalah ...", ["Ureter", "Uretra", "Ginjal", "Kandung kemih"], 3, "Kandung kemih menampung urine sementara sebelum dikeluarkan melalui uretra."),
    soal("Ureter berfungsi membawa urine dari ...", ["Ginjal ke kandung kemih", "Kandung kemih ke luar tubuh", "Hati ke usus", "Jantung ke paru-paru"], 0, "Ureter adalah saluran yang mengalirkan urine dari masing-masing ginjal menuju kandung kemih."),
    soal("Kelenjar yang sering disebut pengendali utama sistem endokrin karena mengatur beberapa kelenjar lain adalah ...", ["Kelenjar ludah", "Hipofisis", "Keringat", "Sebasea"], 1, "Kelenjar hipofisis menghasilkan hormon yang mengendalikan fungsi beberapa kelenjar endokrin lain."),
    soal("Adrenalin terutama diproduksi oleh ...", ["Kelenjar paratiroid", "Kelenjar ludah", "Medula kelenjar adrenal", "Kelenjar minyak"], 2, "Medula adrenal melepaskan adrenalin yang membantu tubuh merespons keadaan darurat."),
    soal("Bagian mata yang mengandung sel batang dan sel kerucut adalah ...", ["Kornea", "Iris", "Lensa", "Retina"], 3, "Retina mengandung fotoreseptor batang dan kerucut untuk mendeteksi cahaya."),
    soal("Bagian telinga dalam yang mengubah getaran menjadi impuls saraf pendengaran adalah ...", ["Koklea", "Daun telinga", "Saluran Eustachius", "Gendang telinga"], 0, "Di koklea, sel rambut mengubah getaran mekanis menjadi sinyal saraf."),
    soal("Limpa berperan antara lain dalam ...", ["Menghasilkan enzim pencernaan utama", "Menyaring darah dan membantu respons imun", "Membentuk empedu", "Menyimpan urine"], 1, "Limpa menyaring darah, membantu respons imun, dan memproses sel darah merah yang sudah tua."),
    soal("Tulang tidak hanya menopang tubuh, tetapi juga menjadi tempat ...", ["Pertukaran gas di alveolus", "Pembuatan empedu", "Pembentukan sel darah di sumsum merah", "Penyaringan urine"], 2, "Sumsum tulang merah di dalam tulang membentuk berbagai jenis sel darah."),
    soal("Otot diafragma berperan langsung dalam ...", ["Menghasilkan insulin", "Memompa darah ke seluruh tubuh", "Menyaring darah", "Membantu perubahan volume rongga dada saat bernapas"], 3, "Kontraksi dan relaksasi diafragma mengubah volume rongga dada sehingga udara masuk atau keluar paru-paru."),
    soal("Kelenjar paratiroid berperan utama dalam mengatur kadar ...", ["Kalsium darah", "Oksigen udara", "Empedu", "Urea dalam urine secara langsung"], 0, "Hormon paratiroid membantu mengatur keseimbangan kalsium dan fosfat dalam tubuh."),
    soal("Organ yang menyerap sebagian besar zat gizi hasil pencernaan adalah ...", ["Kerongkongan", "Usus halus", "Kandung kemih", "Trakea"], 1, "Permukaan usus halus yang luas, dibantu vili dan mikrovili, memungkinkan penyerapan zat gizi secara efisien."),
    soal("Organ yang banyak menyerap air dan membentuk feses adalah ...", ["Lambung", "Hati", "Usus besar", "Pankreas"], 2, "Usus besar menyerap air dan elektrolit serta membantu pembentukan feses."),
    soal("Kelenjar ludah menghasilkan cairan yang membantu pelumasan makanan dan memulai pencernaan ...", ["Protein menjadi asam amino", "Lemak menjadi gliserol sepenuhnya", "DNA menjadi nukleotida", "Pati menjadi molekul lebih sederhana"], 3, "Air liur mengandung amilase yang memulai pemecahan pati menjadi karbohidrat lebih sederhana."),

    // SISTEM PERNAPASAN — 20 soal
    soal("Tempat utama pertukaran oksigen dan karbon dioksida di paru-paru adalah ...", ["Alveolus", "Trakea", "Laring", "Rongga hidung"], 0, "Alveolus berdinding tipis dan dikelilingi kapiler sehingga cocok untuk pertukaran gas."),
    soal("Saat inspirasi normal, diafragma akan ...", ["Mengendur dan melengkung naik", "Berkontraksi dan bergerak turun", "Menutup trakea", "Menghentikan aliran darah paru"], 1, "Kontraksi diafragma membuatnya mendatar dan memperbesar volume rongga dada."),
    soal("Ketika volume rongga dada membesar saat inspirasi, tekanan udara di dalam paru-paru umumnya ...", ["Meningkat jauh di atas atmosfer", "Tidak pernah berubah", "Menurun di bawah tekanan atmosfer", "Menjadi nol mutlak"], 2, "Peningkatan volume menurunkan tekanan intrapulmonal sehingga udara masuk mengikuti gradien tekanan."),
    soal("Saluran yang menghubungkan laring dengan bronkus adalah ...", ["Esofagus", "Ureter", "Aorta", "Trakea"], 3, "Trakea menyalurkan udara dari laring ke bronkus kanan dan kiri."),
    soal("Fungsi silia dan lendir pada saluran pernapasan adalah ...", ["Menangkap dan membantu mengeluarkan partikel asing", "Mengubah oksigen menjadi nitrogen", "Memproduksi sel darah merah", "Mencerna protein"], 0, "Lendir menangkap debu dan patogen, sedangkan silia menggerakkan lendir ke arah faring."),
    soal("Pita suara terutama terdapat di ...", ["Alveolus", "Laring", "Bronkiolus", "Diafragma"], 1, "Laring mengandung pita suara yang bergetar ketika udara melewatinya."),
    soal("Epiglotis membantu mencegah makanan masuk ke ...", ["Kerongkongan", "Lambung", "Saluran pernapasan", "Usus halus"], 2, "Saat menelan, epiglotis membantu menutup jalan masuk laring agar makanan diarahkan ke esofagus."),
    soal("Oksigen dari alveolus masuk ke kapiler terutama melalui proses ...", ["Transport aktif", "Osmosis air", "Endositosis", "Difusi"], 3, "Oksigen berdifusi mengikuti perbedaan tekanan parsial dari alveolus ke darah kapiler."),
    soal("Protein dalam sel darah merah yang mengikat sebagian besar oksigen adalah ...", ["Hemoglobin", "Insulin", "Keratin", "Fibrinogen"], 0, "Hemoglobin mengikat oksigen secara reversibel dan mengangkutnya melalui aliran darah."),
    soal("Mengapa frekuensi pernapasan meningkat saat berolahraga?", ["Tubuh tidak lagi memerlukan oksigen", "Kebutuhan oksigen dan pembuangan karbon dioksida meningkat", "Paru-paru berhenti melakukan difusi", "Suhu tubuh harus selalu turun"], 1, "Aktivitas otot meningkatkan metabolisme sehingga kebutuhan O2 dan produksi CO2 bertambah."),
    soal("Selaput yang membungkus paru-paru dan mengurangi gesekan saat bernapas adalah ...", ["Perikardium", "Peritoneum", "Pleura", "Meninges"], 2, "Pleura beserta cairannya membantu mengurangi gesekan antara paru-paru dan dinding dada."),
    soal("Bronkiolus berbeda dari trakea karena bronkiolus ...", ["Merupakan bagian sistem pencernaan", "Mengangkut urine", "Selalu mengandung tulang rawan berbentuk cincin besar", "Merupakan cabang kecil saluran udara di dalam paru-paru"], 3, "Bronkiolus merupakan cabang kecil bronkus yang menyalurkan udara menuju daerah alveolus."),
    soal("Pernyataan yang tepat tentang respirasi sel adalah ...", ["Menggunakan oksigen untuk membantu menghasilkan ATP pada respirasi aerob", "Berlangsung hanya di rongga hidung", "Sama persis dengan inspirasi", "Tidak melibatkan reaksi kimia"], 0, "Respirasi sel aerob menggunakan oksigen untuk membantu menguraikan zat makanan dan menghasilkan ATP."),
    soal("Pusat pengaturan dasar pernapasan terutama berada di ...", ["Serebelum saja", "Medula oblongata", "Tulang paha", "Pankreas"], 1, "Pusat pernapasan di batang otak, termasuk medula oblongata, mengatur ritme dasar napas."),
    soal("Peningkatan karbon dioksida dalam darah cenderung menyebabkan ...", ["Darah selalu menjadi basa kuat", "Berhentinya seluruh metabolisme", "Penurunan pH darah", "Hilangnya kebutuhan ventilasi"], 2, "CO2 membentuk asam karbonat dalam darah, sehingga kenaikannya cenderung menurunkan pH."),
    soal("Asma terutama ditandai oleh ...", ["Kerusakan tulang belakang", "Produksi empedu berlebihan", "Penyumbatan ureter", "Penyempitan dan peradangan saluran napas"], 3, "Asma melibatkan peradangan dan penyempitan saluran napas yang dapat menimbulkan mengi dan sesak."),
    soal("Tuberkulosis (TBC) terutama disebabkan oleh ...", ["Bakteri Mycobacterium tuberculosis", "Virus influenza saja", "Jamur pada kuku", "Kekurangan hemoglobin semata"], 0, "TBC merupakan penyakit infeksi yang disebabkan oleh bakteri Mycobacterium tuberculosis."),
    soal("Emfisema dapat mengganggu pertukaran gas karena ...", ["Laring menghasilkan terlalu banyak suara", "Dinding alveolus rusak dan luas permukaan pertukaran gas berkurang", "Usus menyerap terlalu banyak air", "Diafragma berubah menjadi tulang"], 1, "Kerusakan dinding alveolus pada emfisema mengurangi luas permukaan untuk difusi gas."),
    soal("Urutan jalur udara yang benar setelah rongga hidung adalah ...", ["Alveolus–trakea–faring", "Esofagus–laring–alveolus", "Faring–laring–trakea–bronkus", "Bronkus–lambung–trakea"], 2, "Udara melewati faring, laring, trakea, bronkus, bronkiolus, lalu mencapai alveolus."),
    soal("Gas yang paling banyak dikeluarkan sebagai sisa respirasi sel melalui paru-paru adalah ...", ["Helium", "Hidrogen", "Ozon", "Karbon dioksida"], 3, "Karbon dioksida dihasilkan dalam metabolisme sel dan dibawa darah ke paru-paru untuk dikeluarkan."),

    // SISTEM PENCERNAAN — 20 soal
    soal("Enzim amilase dalam air liur mulai mencerna ...", ["Pati", "Protein", "Vitamin", "Mineral"], 0, "Amilase saliva memecah pati menjadi karbohidrat yang lebih sederhana."),
    soal("Enzim pepsin di lambung terutama memecah ...", ["Lemak menjadi asam lemak", "Protein menjadi peptida", "Pati menjadi glukosa", "Vitamin menjadi mineral"], 1, "Pepsin bekerja dalam lingkungan asam dan menguraikan protein menjadi peptida."),
    soal("Fungsi utama empedu dalam pencernaan adalah ...", ["Memecah DNA menjadi asam amino", "Mengubah glukosa menjadi oksigen", "Mengemulsikan lemak menjadi butiran kecil", "Menghasilkan asam klorida di lambung"], 2, "Garam empedu memecah gumpalan lemak menjadi tetesan kecil, memperbesar luas permukaan bagi kerja lipase."),
    soal("Enzim lipase berperan dalam pencernaan ...", ["Pati", "Protein", "Asam nukleat saja", "Lemak"], 3, "Lipase menghidrolisis trigliserida menjadi asam lemak dan monogliserida atau produk terkait."),
    soal("Vili dan mikrovili pada usus halus berfungsi untuk ...", ["Memperluas permukaan penyerapan", "Mendorong udara ke paru-paru", "Menyaring urine", "Menghasilkan sel darah merah"], 0, "Lipatan, vili, dan mikrovili memperbesar area kontak untuk penyerapan zat gizi."),
    soal("Gerakan bergelombang otot saluran pencernaan yang mendorong makanan disebut ...", ["Filtrasi", "Peristaltik", "Ventilasi", "Transpirasi"], 1, "Peristaltik adalah kontraksi terkoordinasi otot polos yang menggerakkan isi saluran pencernaan."),
    soal("Asam klorida di lambung membantu ...", ["Menetralkan semua enzim pencernaan", "Menyerap oksigen dari udara", "Menciptakan suasana asam dan mengaktifkan pepsinogen", "Mengubah empedu menjadi insulin"], 2, "HCl membuat lambung bersifat asam dan membantu mengaktifkan pepsinogen menjadi pepsin."),
    soal("Enzim tripsin yang berperan mencerna protein di usus halus berasal dari ...", ["Kelenjar tiroid", "Kelenjar keringat", "Kantung empedu", "Pankreas"], 3, "Pankreas melepaskan tripsinogen yang kemudian diaktifkan di usus halus menjadi tripsin."),
    soal("Penyerapan utama hasil pencernaan karbohidrat, protein, dan lemak terjadi di ...", ["Usus halus", "Kerongkongan", "Mulut saja", "Usus buntu"], 0, "Sebagian besar hasil pencernaan zat gizi diserap melalui dinding usus halus."),
    soal("Enzim laktase membantu menguraikan laktosa menjadi ...", ["Asam amino dan gliserol", "Glukosa dan galaktosa", "Glukosa dan fruktosa", "Asam lemak dan vitamin"], 1, "Laktase menghidrolisis laktosa menjadi dua monosakarida, yaitu glukosa dan galaktosa."),
    soal("Pankreas melepaskan bikarbonat ke duodenum terutama untuk ...", ["Meningkatkan keasaman isi usus", "Membentuk sel darah merah", "Menetralkan asam dari lambung", "Mengangkut oksigen"], 2, "Bikarbonat pankreas membantu menaikkan pH isi duodenum agar enzim usus bekerja baik."),
    soal("Organ yang menyimpan dan memekatkan empedu adalah ...", ["Limpa", "Apendiks", "Ginjal", "Kandung empedu"], 3, "Kandung empedu menyimpan dan memekatkan empedu yang diproduksi oleh hati."),
    soal("Fungsi utama usus besar adalah ...", ["Menyerap air dan elektrolit serta memadatkan feses", "Memproduksi oksigen", "Mencerna seluruh protein dengan pepsin", "Memompa darah"], 0, "Usus besar menyerap air dan elektrolit, lalu membantu membentuk feses."),
    soal("Urutan saluran pencernaan yang benar adalah ...", ["Mulut–lambung–faring–usus halus", "Mulut–faring–kerongkongan–lambung–usus halus", "Lambung–mulut–usus besar–faring", "Mulut–trakea–lambung–ginjal"], 1, "Makanan melewati mulut, faring, esofagus, lambung, usus halus, lalu usus besar."),
    soal("Enzim protease terutama berfungsi menguraikan ...", ["Vitamin", "Air", "Protein", "Mineral"], 2, "Protease merupakan kelompok enzim yang memutus ikatan peptida pada protein."),
    soal("Zat gizi yang biasanya menjadi sumber energi utama bagi tubuh adalah ...", ["Air", "Mineral", "Vitamin", "Karbohidrat"], 3, "Karbohidrat merupakan sumber energi utama yang umum digunakan tubuh, terutama dalam bentuk glukosa."),
    soal("Penyerapan sebagian besar hasil pencernaan lemak melibatkan pembentukan ...", ["Misel dan kemudian pengangkutan melalui sel usus", "Sel darah merah di lambung", "Urine di duodenum", "Udara di vili"], 0, "Produk pencernaan lemak dibantu garam empedu membentuk misel, lalu masuk ke sel usus dan banyak diangkut sebagai kilomikron."),
    soal("Seseorang yang tidak menghasilkan cukup laktase dapat mengalami ... setelah mengonsumsi laktosa.", ["Peningkatan pembentukan tulang", "Gangguan pencernaan seperti kembung dan diare", "Peningkatan fotosintesis", "Penurunan denyut tanpa sebab"], 1, "Laktosa yang tidak tercerna dapat difermentasi bakteri usus dan menarik air ke lumen usus."),
    soal("Proses menelan memindahkan makanan dari mulut menuju ...", ["Trakea lalu paru-paru", "Ureter menuju ginjal", "Faring dan esofagus", "Aorta menuju jantung"], 2, "Setelah ditelan, makanan lewat faring dan diarahkan ke esofagus, bukan ke saluran napas."),
    soal("Salah satu fungsi hati dalam metabolisme zat gizi adalah ...", ["Menyaring udara inspirasi", "Menghasilkan impuls listrik jantung", "Menyimpan urine", "Mengolah zat gizi dan menyimpan glikogen"], 3, "Hati mengatur banyak proses metabolisme, termasuk menyimpan glukosa dalam bentuk glikogen."),

    // SISTEM PEREDARAN DARAH — 20 soal
    soal("Ruang jantung yang memompa darah kaya oksigen ke seluruh tubuh adalah ...", ["Bilik kiri", "Serambi kanan", "Bilik kanan", "Serambi kiri"], 0, "Ventrikel kiri memompa darah beroksigen ke aorta dan sirkulasi sistemik."),
    soal("Pembuluh yang membawa darah dari jantung menuju paru-paru adalah ...", ["Vena pulmonalis", "Arteri pulmonalis", "Aorta", "Vena kava"], 1, "Arteri pulmonalis membawa darah dari ventrikel kanan menuju paru-paru; darahnya relatif rendah oksigen."),
    soal("Pembuluh vena pulmonalis membawa darah ...", ["Rendah oksigen dari tubuh ke jantung kanan", "Dari jantung ke paru-paru", "Kaya oksigen dari paru-paru ke serambi kiri", "Dari usus langsung ke ginjal saja"], 2, "Vena pulmonalis adalah pengecualian umum pada aturan sederhana vena: pembuluh ini membawa darah kaya oksigen ke jantung."),
    soal("Komponen darah yang mengangkut sebagian besar oksigen adalah ...", ["Trombosit", "Plasma saja", "Limfosit", "Sel darah merah"], 3, "Hemoglobin dalam sel darah merah mengikat dan mengangkut sebagian besar oksigen dalam darah."),
    soal("Fungsi utama sel darah putih adalah ...", ["Pertahanan tubuh terhadap patogen", "Pembekuan darah sebagai tugas tunggal", "Pengangkutan oksigen utama", "Menghasilkan empedu"], 0, "Leukosit berperan dalam pertahanan imun dan melawan infeksi."),
    soal("Komponen darah yang berperan penting dalam pembekuan adalah ...", ["Eritrosit", "Trombosit", "Neuron", "Alveolus"], 1, "Trombosit membantu membentuk sumbat awal dan mendukung proses pembekuan darah."),
    soal("Bagian cair darah yang mengangkut zat terlarut, hormon, dan protein disebut ...", ["Limfa padat", "Sumsum", "Plasma", "Hemoglobin"], 2, "Plasma adalah matriks cair darah yang membawa berbagai zat terlarut dan protein."),
    soal("Dalam transfusi sel darah merah, golongan O negatif sering disebut donor universal karena ...", ["Memiliki semua antigen A dan B", "Sel darahnya tidak mempunyai hemoglobin", "Hanya dapat diberikan kepada golongan O positif", "Sel darah merahnya tidak memiliki antigen A, B, dan Rh(D)"], 3, "Sel darah merah O negatif tidak membawa antigen A, B, dan Rh(D), sehingga berisiko lebih rendah memicu reaksi pada banyak penerima; pencocokan tetap diperlukan."),
    soal("Peredaran darah sistemik dimulai ketika darah dipompa dari ...", ["Ventrikel kiri menuju jaringan tubuh", "Ventrikel kanan menuju paru-paru", "Serambi kanan menuju lambung saja", "Paru-paru menuju bronkus"], 0, "Sirkulasi sistemik mengalir dari ventrikel kiri melalui aorta ke seluruh jaringan, lalu kembali ke serambi kanan."),
    soal("Peredaran darah pulmonal mengalirkan darah dari ...", ["Serambi kiri ke seluruh tubuh", "Ventrikel kanan ke paru-paru lalu kembali ke jantung", "Ginjal ke hati tanpa melalui jantung", "Aorta ke usus saja"], 1, "Sirkulasi pulmonal membawa darah dari ventrikel kanan ke paru-paru dan kembali ke serambi kiri."),
    soal("Pembuluh yang menjadi lokasi utama pertukaran zat antara darah dan jaringan adalah ...", ["Aorta", "Vena kava", "Kapiler", "Arteri pulmonalis"], 2, "Dinding kapiler yang sangat tipis memungkinkan pertukaran gas, nutrisi, dan sisa metabolisme."),
    soal("Katup jantung berfungsi untuk ...", ["Menghasilkan sel darah", "Memecah glukosa", "Menyaring urine", "Mencegah aliran balik darah"], 3, "Katup membuka dan menutup sesuai perbedaan tekanan untuk menjaga aliran darah satu arah."),
    soal("Denyut nadi umumnya terasa sebagai gelombang tekanan pada ...", ["Arteri", "Alveolus", "Kerongkongan", "Ureter"], 0, "Kontraksi jantung menghasilkan gelombang tekanan yang dapat dirasakan pada arteri dekat permukaan tubuh."),
    soal("Pembuluh koroner berfungsi memasok darah ke ...", ["Kulit kepala saja", "Otot jantung", "Dinding usus saja", "Tulang rawan telinga"], 1, "Arteri koroner mengirim oksigen dan nutrisi ke jaringan otot jantung itu sendiri."),
    soal("Tekanan darah tinggi yang berlangsung lama disebut ...", ["Anemia", "Leukemia", "Hipertensi", "Hemofilia"], 2, "Hipertensi adalah kondisi tekanan darah yang terus-menerus tinggi dan dapat meningkatkan risiko penyakit kardiovaskular."),
    soal("Sel darah merah berbentuk bikonkaf, yang membantu ...", ["Membuatnya mampu melakukan fotosintesis", "Menyimpan empedu", "Membentuk tulang", "Memperluas permukaan pertukaran gas dan membantu kelenturan"], 3, "Bentuk bikonkaf memperbesar rasio luas permukaan terhadap volume dan membantu sel melewati kapiler."),
    soal("Denyut jantung umumnya meningkat saat aktivitas fisik karena ...", ["Otot memerlukan suplai oksigen dan nutrisi lebih besar", "Tubuh berhenti menggunakan ATP", "Darah tidak perlu mengalir", "Paru-paru tidak lagi bekerja"], 0, "Jantung meningkatkan curah jantung untuk memenuhi kebutuhan metabolik otot yang meningkat."),
    soal("Hemoglobin yang mengikat karbon monoksida dapat berbahaya karena ...", ["Membuat darah membawa lebih banyak oksigen", "Menghambat pengangkutan oksigen", "Mengubah semua sel darah menjadi trombosit", "Meningkatkan fotosintesis"], 1, "Karbon monoksida berikatan kuat dengan hemoglobin sehingga mengurangi kapasitas darah membawa oksigen."),
    soal("Tekanan darah diastolik terjadi ketika bilik jantung ...", ["Sedang berkontraksi maksimal", "Mengosongkan udara paru", "Relatif relaks dan terisi", "Tidak memiliki darah sama sekali"], 2, "Tekanan diastolik adalah tekanan arteri terendah selama fase relaksasi jantung."),
    soal("Sirkulasi portal hepatik membawa darah kaya zat yang diserap dari saluran cerna menuju ...", ["Paru-paru tanpa melewati hati", "Jantung kiri secara langsung", "Kandung kemih", "Hati"], 3, "Vena porta hepatika membawa darah dari saluran pencernaan dan organ terkait ke hati untuk diproses."),

    // SISTEM REPRODUKSI — 20 soal
    soal("Tempat pembentukan sperma pada sistem reproduksi pria adalah ...", ["Tubulus seminiferus di testis", "Vesikula seminalis saja", "Prostat", "Ureter"], 0, "Spermatogenesis berlangsung di tubulus seminiferus dalam testis."),
    soal("Hormon testosteron terutama diproduksi oleh sel ... di testis.", ["Sertoli saja", "Leydig", "Epitel alveolus", "Beta pankreas"], 1, "Sel Leydig menghasilkan testosteron sebagai respons terhadap hormon LH."),
    soal("Pelepasan sel telur matang dari ovarium disebut ...", ["Menstruasi", "Implantasi", "Ovulasi", "Fertilisasi"], 2, "Ovulasi adalah pelepasan oosit dari folikel ovarium, biasanya dipicu lonjakan LH."),
    soal("Pada manusia, pembuahan paling sering terjadi di ...", ["Rahim bagian bawah", "Vagina", "Ovarium", "Tuba falopi"], 3, "Fertilisasi umumnya terjadi di bagian ampula tuba falopi."),
    soal("Hormon yang membantu mempertahankan lapisan endometrium setelah ovulasi adalah ...", ["Progesteron", "Adrenalin", "Tiroksin", "Melatonin"], 0, "Progesteron dari korpus luteum membantu mempertahankan endometrium untuk kemungkinan kehamilan."),
    soal("Organ yang memungkinkan pertukaran oksigen, zat gizi, dan sisa metabolisme antara ibu dan janin adalah ...", ["Apendiks", "Plasenta", "Kandung empedu", "Pankreas ibu secara langsung"], 1, "Plasenta merupakan organ pertukaran antara sirkulasi ibu dan janin tanpa biasanya mencampurkan darah keduanya secara langsung."),
    soal("Cairan ketuban berfungsi antara lain untuk ...", ["Menghentikan seluruh pertumbuhan janin", "Menggantikan fungsi semua organ ibu", "Melindungi janin dari benturan dan membantu menjaga lingkungan", "Mencerna makanan ibu"], 2, "Cairan amnion memberi bantalan, memungkinkan gerak, dan membantu menjaga lingkungan perkembangan janin."),
    soal("Jika tidak terjadi kehamilan, penurunan hormon ovarium dapat menyebabkan ...", ["Pembentukan plasenta baru", "Ovulasi setiap hari", "Pembentukan sperma", "Peluruhan lapisan endometrium saat menstruasi"], 3, "Turunnya progesteron dan estrogen memicu peluruhan endometrium yang tampak sebagai menstruasi."),
    soal("Lonjakan hormon LH pada siklus menstruasi umumnya memicu ...", ["Ovulasi", "Pembentukan urine", "Produksi empedu", "Pencernaan pati"], 0, "Lonjakan LH memicu rangkaian peristiwa yang menyebabkan ovulasi."),
    soal("Pada wanita, FSH berperan penting dalam ...", ["Menghasilkan empedu", "Merangsang perkembangan folikel ovarium", "Mengatur kontraksi diafragma", "Membentuk trombosit"], 1, "FSH merangsang pertumbuhan dan perkembangan folikel ovarium."),
    soal("Tempat pematangan dan penyimpanan sementara sperma setelah keluar dari testis adalah ...", ["Uretra saja", "Prostat", "Epididimis", "Kandung kemih"], 2, "Sperma mengalami pematangan fungsional dan disimpan sementara di epididimis."),
    soal("Saluran yang membawa sperma dari epididimis menuju saluran ejakulasi adalah ...", ["Ureter", "Tuba falopi", "Trakea", "Vas deferens"], 3, "Vas deferens membawa sperma dari epididimis menuju saluran ejakulasi."),
    soal("Enzim pada akrosom sperma membantu ...", ["Membantu sperma menembus lapisan pelindung oosit", "Menghasilkan sel darah merah", "Menghentikan meiosis pada semua sel", "Menghasilkan hormon insulin"], 0, "Akrosom mengandung enzim yang membantu sperma menembus lapisan di sekitar oosit saat fertilisasi."),
    soal("Pembelahan meiosis pada pembentukan gamet menghasilkan sel dengan jumlah kromosom ...", ["Dua kali lipat dari sel tubuh", "Setengah jumlah sel tubuh", "Selalu nol", "Empat kali jumlah sel tubuh"], 1, "Meiosis mengurangi jumlah kromosom menjadi haploid agar jumlah diploid pulih saat fertilisasi."),
    soal("Sel pertama yang terbentuk setelah peleburan gamet disebut ...", ["Embrio lanjut", "Plasenta matang", "Zigot", "Folikel"], 2, "Zigot merupakan sel diploid hasil penyatuan inti gamet jantan dan betina."),
    soal("Implantasi embrio biasanya berlangsung pada ...", ["Permukaan ovarium", "Dinding ureter", "Alveolus paru", "Endometrium rahim"], 3, "Blastokista menempel dan mulai tertanam pada lapisan endometrium rahim."),
    soal("Kembar identik umumnya terbentuk ketika ...", ["Satu zigot membelah menjadi dua embrio", "Dua ovum dibuahi dua sperma berbeda", "Tidak terjadi fertilisasi", "Satu sperma membentuk dua ovum"], 0, "Kembar monozigotik berasal dari satu zigot yang kemudian terpisah menjadi dua embrio."),
    soal("Ciri kelamin sekunder pada masa pubertas berkembang terutama karena perubahan ...", ["Kadar mineral air", "Hormon kelamin", "Tekanan udara luar", "Jumlah klorofil"], 1, "Peningkatan hormon kelamin saat pubertas mendorong perkembangan ciri kelamin sekunder."),
    soal("Metode kontrasepsi berupa kondom juga dapat membantu mengurangi risiko ...", ["Semua penyakit tanpa pengecualian", "Kekurangan vitamin", "Penularan banyak infeksi menular seksual", "Diabetes tipe 1"], 2, "Kondom yang digunakan dengan benar membantu menurunkan risiko kehamilan dan penularan banyak IMS, meski tidak menghilangkan semua risiko."),
    soal("Fertilisasi in vitro (IVF) berarti pembuahan dilakukan ...", ["Di dalam alveolus", "Di dalam ginjal", "Di dalam tulang", "Di luar tubuh, kemudian embrio dipindahkan ke rahim"], 3, "Pada IVF, oosit dan sperma dipertemukan di laboratorium; embrio yang berkembang dapat dipindahkan ke rahim."),

    // TUMBUHAN — 20 soal
    soal("Jaringan tumbuhan yang mengangkut air dan mineral dari akar ke bagian atas adalah ...", ["Xilem", "Floem", "Epidermis gabus saja", "Kambium gabus"], 0, "Xilem terutama mengangkut air dan mineral dari akar menuju batang dan daun."),
    soal("Jaringan yang mengangkut hasil fotosintesis dari daun ke bagian lain tumbuhan adalah ...", ["Xilem", "Floem", "Sklerenkim saja", "Kutikula"], 1, "Floem mentranslokasikan gula dan senyawa organik dari sumber ke bagian yang membutuhkan atau menyimpan."),
    soal("Pertukaran gas pada sebagian besar daun berlangsung melalui ...", ["Kambium", "Rambut akar", "Stomata", "Bunga"], 2, "Stomata adalah pori pada epidermis yang mengatur pertukaran gas dan kehilangan uap air."),
    soal("Pigmen hijau yang menyerap energi cahaya untuk fotosintesis adalah ...", ["Hemoglobin", "Melanin", "Keratin", "Klorofil"], 3, "Klorofil menyerap panjang gelombang cahaya yang digunakan dalam reaksi fotosintesis."),
    soal("Bahan baku utama fotosintesis adalah ...", ["Karbon dioksida dan air", "Oksigen dan glukosa saja", "Protein dan nitrogen gas saja", "Garam empedu dan air"], 0, "Fotosintesis menggunakan CO2 dan H2O dengan energi cahaya untuk membentuk karbohidrat dan melepaskan O2."),
    soal("Rambut akar membantu penyerapan air karena ...", ["Mengurangi seluruh permukaan akar", "Memperbesar luas permukaan kontak dengan tanah", "Memproduksi cahaya", "Menutup semua celah tanah"], 1, "Rambut akar memperbesar permukaan kontak sehingga penyerapan air dan mineral lebih efisien."),
    soal("Jaringan meristem berfungsi untuk ...", ["Mengangkut darah", "Mencerna pati", "Membelah dan menghasilkan sel baru", "Menangkap suara"], 2, "Sel meristem aktif membelah dan mendukung pertumbuhan primer atau sekunder tumbuhan."),
    soal("Penguapan air dari permukaan tumbuhan, terutama melalui stomata, disebut ...", ["Fermentasi", "Fertilisasi", "Translasi", "Transpirasi"], 3, "Transpirasi adalah kehilangan air sebagai uap dari tumbuhan, terutama melalui stomata daun."),
    soal("Perpindahan serbuk sari dari kepala sari ke kepala putik disebut ...", ["Penyerbukan", "Perkecambahan", "Transpirasi", "Fotolisis"], 0, "Penyerbukan memindahkan serbuk sari ke kepala putik; pembuahan terjadi kemudian setelah gamet bertemu."),
    soal("Gerak pertumbuhan batang menuju arah datangnya cahaya disebut ...", ["Geotropisme negatif akar", "Fototropisme positif", "Hidrotropisme negatif", "Nasti termal"], 1, "Batang umumnya menunjukkan fototropisme positif, tumbuh menuju sumber cahaya."),
    soal("Hormon tumbuhan yang berperan dalam pemanjangan sel dan respons fototropisme adalah ...", ["Insulin", "Adrenalin", "Auksin", "Tiroksin"], 2, "Auksin membantu pemanjangan sel dan distribusinya dapat menyebabkan batang membengkok ke arah cahaya."),
    soal("Sel penjaga berfungsi mengatur ...", ["Pembentukan sel darah", "Penyaringan urine", "Pemompaan darah", "Buka-tutup stomata"], 3, "Perubahan tekanan turgor sel penjaga mengatur pembukaan dan penutupan stomata."),
    soal("Bakteri Rhizobium pada bintil akar leguminosa membantu ...", ["Fiksasi nitrogen atmosfer", "Fotosintesis di daun", "Mengubah oksigen menjadi cahaya", "Mengangkut air melalui xilem"], 0, "Rhizobium bersimbiosis dengan tanaman legum dan mengikat nitrogen atmosfer menjadi bentuk yang dapat dimanfaatkan."),
    soal("Respirasi pada tumbuhan ...", ["Hanya berlangsung ketika ada cahaya", "Berlangsung siang dan malam pada sel hidup", "Hanya terjadi pada akar", "Menghasilkan makanan dengan energi cahaya"], 1, "Respirasi sel berlangsung untuk menghasilkan ATP pada jaringan hidup, baik siang maupun malam."),
    soal("Tumbuhan berbiji tertutup disebut ...", ["Bryophyta", "Pteridophyta", "Angiospermae", "Gymnospermae"], 2, "Angiospermae adalah tumbuhan berbunga yang bijinya berkembang di dalam ovarium yang menjadi buah."),
    soal("Ciri khas Gymnospermae adalah ...", ["Tidak memiliki jaringan pembuluh", "Selalu berkembang biak dengan spora", "Tidak memiliki embrio", "Biji tidak tertutup oleh buah sejati"], 3, "Gymnospermae disebut tumbuhan berbiji terbuka karena bijinya tidak tertutup ovarium menjadi buah sejati."),
    soal("Jaringan yang aktif membelah di ujung akar dan batang disebut meristem ...", ["Apikal", "Lateral saja", "Interkalar hanya di daun tua", "Pelindung"], 0, "Meristem apikal terletak di ujung akar dan batang serta menyebabkan pertumbuhan memanjang."),
    soal("Pada fotosintesis, oksigen yang dilepaskan terutama berasal dari ...", ["Karbon dioksida yang langsung terbelah", "Air yang mengalami fotolisis", "Gula yang dibakar", "Nitrogen udara"], 1, "Oksigen yang dilepaskan fotosintesis berasal dari pemecahan molekul air pada reaksi terang."),
    soal("Penyerapan mineral oleh akar dari tanah sering melibatkan ...", ["Pendengaran", "Peristaltik", "Transport aktif melalui membran", "Kontraksi jantung"], 2, "Ion mineral dapat diserap melawan gradien konsentrasi dengan protein pembawa dan energi."),
    soal("Buah umumnya berkembang dari bagian bunga yang disebut ... setelah pembuahan.", ["Kepala sari", "Mahkota", "Kelopak", "Ovarium"], 3, "Pada tumbuhan berbunga, ovarium umumnya berkembang menjadi buah setelah pembuahan."),

    // HEWAN — 20 soal
    soal("Hewan yang tidak memiliki tulang belakang termasuk kelompok ...", ["Invertebrata", "Vertebrata", "Mamalia", "Aves"], 0, "Invertebrata adalah hewan yang tidak memiliki tulang belakang."),
    soal("Ciri khas mamalia adalah memiliki ...", ["Insang sepanjang hidup", "Kelenjar susu untuk menyusui anak", "Eksoskeleton dari kitin", "Tubuh selalu bersisik kering"], 1, "Mamalia memiliki kelenjar susu; sebagian besar juga memiliki rambut dan tiga tulang pendengaran tengah."),
    soal("Hewan arthropoda memiliki ...", ["Rangka dalam dari tulang sejati pada semua jenis", "Tubuh tanpa ruas", "Eksoskeleton dan kaki berbuku-buku", "Seluruh tubuh berupa satu sel"], 2, "Arthropoda memiliki eksoskeleton, tubuh bersegmen, dan apendiks berbuku-buku."),
    soal("Tubuh serangga dewasa umumnya terbagi menjadi ...", ["Kepala dan ekor saja", "Kepala, leher, dan sayap", "Dada dan perut saja", "Kepala, dada, dan perut"], 3, "Bau tubuh serangga umumnya terdiri atas kepala, toraks, dan abdomen."),
    soal("Hewan amfibi seperti katak umumnya mengalami ...", ["Metamorfosis dari larva ke dewasa", "Pergantian eksoskeleton seperti serangga", "Pembentukan biji", "Fotosintesis"], 0, "Katak mengalami metamorfosis, dari berudu yang hidup di air menuju bentuk dewasa."),
    soal("Ikan umumnya mengambil oksigen terlarut dari air dengan ...", ["Paru-paru beralveolus seperti mamalia", "Insang", "Stomata", "Kulit bersisik tanpa aliran air"], 1, "Insang menyediakan permukaan pertukaran gas antara air dan darah."),
    soal("Ciri yang membantu burung mempertahankan aliran udara yang efisien saat bernapas adalah ...", ["Tidak memiliki paru-paru", "Mengambil oksigen lewat kulit saja", "Sistem pundi-pundi udara yang mendukung aliran udara melalui paru-paru", "Menggunakan insang"], 2, "Pundi-pundi udara mendukung aliran udara satu arah melalui paru-paru burung, sehingga pertukaran gas efisien."),
    soal("Echinodermata seperti bintang laut memiliki sistem yang khas berupa ...", ["Sistem pembuluh angkut tumbuhan", "Trakea serangga", "Paru-paru berlobus empat", "Sistem pembuluh air"], 3, "Sistem pembuluh air membantu pergerakan kaki tabung dan fungsi lain pada Echinodermata."),
    soal("Hewan Cnidaria, seperti ubur-ubur, memiliki sel penyengat yang disebut ...", ["Knidosit", "Eritrosit", "Osteosit", "Neuron motorik saja"], 0, "Knidosit mengandung struktur penyengat yang digunakan untuk menangkap mangsa dan pertahanan."),
    soal("Kaki berotot merupakan struktur gerak yang umum pada filum ...", ["Porifera", "Mollusca", "Cnidaria", "Echinodermata"], 1, "Banyak Mollusca, seperti siput, menggunakan kaki berotot untuk bergerak."),
    soal("Cacing tanah termasuk Annelida karena tubuhnya ...", ["Tidak memiliki jaringan", "Memiliki eksoskeleton kitin", "Bersegmen atau beruas-ruas", "Selalu hidup di laut"], 2, "Annelida adalah kelompok cacing bersegmen, termasuk cacing tanah dan lintah."),
    soal("Reptil umumnya memiliki kulit ...", ["Lembap tanpa lapisan pelindung", "Ditutupi bulu", "Ditutupi rambut", "Kering dengan sisik keratin"], 3, "Reptil umumnya memiliki kulit kering bersisik yang membantu mengurangi kehilangan air."),
    soal("Kelelawar menemukan mangsa atau mengorientasikan diri dalam gelap dengan bantuan ...", ["Fotosintesis", "Ekolokasi pada banyak spesies", "Garis rusuk seperti ikan saja", "Stomata"], 1, "Banyak kelelawar menggunakan ekolokasi dengan memancarkan suara dan menganalisis gema yang kembali."),
    soal("Hewan berpori yang umumnya menetap dan termasuk Porifera adalah ...", ["Bintang laut", "Cacing tanah", "Spons", "Belalang"], 2, "Spons memiliki banyak pori tempat air masuk dan menyaring partikel makanan."),
    soal("Ciri yang membedakan vertebrata dari invertebrata adalah adanya ...", ["Kloroplas", "Dinding sel selulosa", "Eksoskeleton kitin pada semua jenis", "Tulang belakang"], 3, "Vertebrata memiliki ruas tulang belakang yang melindungi bagian dari sistem saraf pusat."),
    soal("Pada metamorfosis sempurna serangga, tahap yang benar adalah ...", ["Telur–larva–pupa–imago", "Telur–nimfa–imago saja", "Larva–biji–imago", "Telur–pupa–zigot"], 0, "Metamorfosis sempurna memiliki empat tahap: telur, larva, pupa, dan imago."),
    soal("Cacing tanah membantu aerasi tanah terutama melalui ...", ["Menghasilkan klorofil", "Aktivitas menggali dan mengaduk tanah", "Memompa air ke daun", "Membentuk akar"], 1, "Gerakan cacing membuat liang dan mencampur bahan organik, sehingga aerasi dan struktur tanah dapat membaik."),
    soal("Serangga bernapas melalui sistem ...", ["Alveolus paru-paru seperti mamalia", "Insang bertulang", "Trakea dan spirakel", "Pembuluh xilem"], 2, "Udara masuk melalui spirakel dan bergerak dalam sistem trakea menuju jaringan tubuh serangga."),
    soal("Burung dan mamalia umumnya termasuk hewan endoterm, artinya ...", ["Suhu tubuh selalu sama dengan suhu air", "Tidak memerlukan energi", "Tidak memiliki metabolisme", "Dapat mempertahankan suhu tubuh dengan menghasilkan panas metabolik"], 3, "Hewan endoterm menghasilkan panas metabolik dan mengatur suhu internal dalam rentang yang relatif stabil."),
    soal("Banyak ikan bertulang rawan, seperti hiu, memiliki rangka terutama dari ...", ["Tulang rawan", "Selulosa", "Kitin", "Silika"], 0, "Hiu dan pari termasuk Chondrichthyes, yang rangkanya terutama tersusun atas tulang rawan."),

    // EKOSISTEM — 20 soal
    soal("Komponen hidup dalam ekosistem disebut komponen ...", ["Abiotik", "Biotik", "Geologis saja", "Atmosferik saja"], 1, "Komponen biotik mencakup organisme hidup seperti tumbuhan, hewan, jamur, dan mikroorganisme."),
    soal("Contoh komponen abiotik dalam ekosistem adalah ...", ["Jamur", "Rumput", "Cahaya matahari", "Belalang"], 2, "Cahaya matahari adalah faktor tak hidup yang memengaruhi proses ekosistem."),
    soal("Organisme yang membuat bahan organik sendiri dari zat anorganik disebut ...", ["Konsumen puncak", "Detritivor", "Parasit obligat saja", "Produsen"], 3, "Produsen seperti tumbuhan dan fitoplankton membentuk bahan organik, umumnya melalui fotosintesis."),
    soal("Hubungan antara lebah yang memperoleh nektar dan bunga yang terbantu penyerbukannya merupakan ...", ["Mutualisme", "Parasitisme", "Kompetisi", "Amensalisme selalu"], 0, "Dalam mutualisme, kedua organisme memperoleh manfaat: lebah mendapat makanan dan bunga terbantu penyerbukannya."),
    soal("Hubungan ketika satu organisme diuntungkan sedangkan organisme lain dirugikan disebut ...", ["Komensalisme", "Parasitisme", "Mutualisme", "Netralisme"], 1, "Parasitisme memberi keuntungan pada parasit dan merugikan inang."),
    soal("Dalam komensalisme, satu organisme diuntungkan sedangkan organisme lain ...", ["Selalu mati", "Selalu diuntungkan sama besar", "Tidak terpengaruh secara berarti", "Pasti dirugikan berat"], 2, "Komensalisme adalah interaksi ketika satu pihak mendapat manfaat dan pihak lain tidak mengalami pengaruh berarti."),
    soal("Sekumpulan individu dari spesies yang sama yang hidup di tempat dan waktu tertentu disebut ...", ["Komunitas", "Bioma", "Ekosistem", "Populasi"], 3, "Populasi terdiri atas individu satu spesies yang menempati area tertentu pada waktu tertentu."),
    soal("Kumpulan berbagai populasi yang hidup dan berinteraksi di suatu tempat disebut ...", ["Komunitas", "Organ", "Spesies tunggal", "Individu"], 0, "Komunitas mencakup berbagai populasi yang berinteraksi dalam satu area."),
    soal("Ekosistem terdiri atas ...", ["Hanya hewan dan tumbuhan", "Komunitas organisme serta lingkungan abiotiknya", "Hanya tanah dan air", "Hanya organisme produsen"], 1, "Ekosistem mencakup komponen biotik dan abiotik beserta interaksinya."),
    soal("Tempat alami suatu organisme hidup disebut ...", ["Relung", "Populasi", "Habitat", "Tingkat trofik"], 2, "Habitat adalah tempat atau lingkungan tempat organisme hidup."),
    soal("Peran dan cara suatu spesies memanfaatkan sumber daya serta berinteraksi dalam ekosistem disebut ...", ["Habitat saja", "Biomassa", "Populasi", "Relung ekologis"], 3, "Relung ekologis menggambarkan peran spesies, kondisi yang ditoleransi, serta penggunaan sumber daya."),
    soal("Daya dukung lingkungan adalah ...", ["Jumlah maksimum individu yang dapat didukung lingkungan secara berkelanjutan", "Jumlah spesies yang selalu nol", "Jumlah predator tanpa batas", "Laju fotosintesis satu daun saja"], 0, "Daya dukung adalah ukuran populasi maksimum yang dapat ditopang sumber daya lingkungan dalam jangka tertentu."),
    soal("Persaingan antorganisme umumnya terjadi ketika mereka ...", ["Tidak berbagi kebutuhan apa pun", "Memerlukan sumber daya terbatas yang sama", "Selalu saling membantu", "Tidak hidup di habitat mana pun"], 1, "Kompetisi terjadi ketika organisme memakai sumber daya yang terbatas, misalnya makanan, ruang, atau cahaya."),
    soal("Keanekaragaman hayati mencakup variasi pada tingkat ...", ["Suhu saja", "Air saja", "Gen, spesies, dan ekosistem", "Mineral saja"], 2, "Keanekaragaman hayati mencakup keragaman genetik, spesies, dan ekosistem."),
    soal("Dalam siklus karbon, fotosintesis berperan dengan cara ...", ["Mengubah oksigen menjadi nitrogen", "Menghilangkan semua karbon dari bumi", "Membentuk batuan secara langsung saja", "Mengambil CO2 dari lingkungan untuk membentuk senyawa organik"], 3, "Produsen memanfaatkan CO2 untuk menyusun bahan organik melalui fotosintesis."),
    soal("Bakteri tertentu berperan dalam siklus nitrogen dengan melakukan ...", ["Fiksasi nitrogen atau nitrifikasi", "Pembentukan cahaya", "Penguapan batuan", "Produksi gelombang bunyi"], 0, "Berbagai bakteri mengubah nitrogen menjadi bentuk kimia yang dapat digunakan organisme atau mengembalikannya ke atmosfer."),
    soal("Suksesi ekologis adalah ...", ["Perpindahan harian hewan saja", "Perubahan bertahap komposisi komunitas dari waktu ke waktu", "Pembentukan satu sel", "Pelepasan oksigen dari hemoglobin"], 1, "Suksesi merupakan perubahan berurutan struktur komunitas ekologi dari waktu ke waktu."),
    soal("Pencemaran yang menyebabkan nutrien berlebih dan ledakan alga di perairan disebut ...", ["Desertifikasi", "Evaporasi", "Eutrofikasi", "Sublimasi"], 2, "Masukan nitrogen dan fosfor berlebih dapat memicu eutrofikasi, yang dapat menurunkan oksigen terlarut."),
    soal("Upaya konservasi in situ melindungi spesies ...", ["Hanya di laboratorium", "Hanya melalui bank benih", "Di kebun binatang saja", "Di habitat alaminya"], 3, "Konservasi in situ menjaga spesies di lingkungan alaminya, misalnya taman nasional atau cagar alam."),
    soal("Biomagnifikasi berarti ...", ["Konsentrasi zat pencemar tertentu meningkat pada tingkat trofik yang lebih tinggi", "Semua zat hilang pada setiap tingkat", "Energi tercipta dari ketiadaan", "Populasi selalu bertambah tanpa batas"], 0, "Zat persisten yang sulit diuraikan dapat terakumulasi dan mencapai konsentrasi lebih tinggi pada predator tingkat atas."),

    // RANTAI MAKANAN — 20 soal
    soal("Urutan rantai makanan darat yang benar adalah ...", ["Elang–rumput–katak–belalang", "Rumput–belalang–katak–ular", "Katak–rumput–ular–belalang", "Ular–belalang–rumput–katak"], 1, "Rumput dimakan belalang, belalang dimakan katak, dan katak dapat dimakan ular."),
    soal("Dalam rantai makanan, tumbuhan hijau biasanya menempati tingkat trofik ...", ["Kedua", "Ketiga", "Pertama", "Keempat"], 2, "Produsen berada pada tingkat trofik pertama karena memasukkan energi ke jaringan makanan."),
    soal("Sumber energi awal terbesar bagi sebagian besar rantai makanan adalah ...", ["Panas dari predator", "Mineral tanah", "Energi dari pengurai saja", "Matahari"], 3, "Sebagian besar ekosistem memperoleh energi awal dari cahaya matahari yang ditangkap produsen."),
    soal("Jika produsen menyimpan energi 10.000 kJ, menurut aturan perkiraan 10%, energi yang tersedia bagi konsumen primer sekitar ...", ["1.000 kJ", "5.000 kJ", "10.000 kJ", "100.000 kJ"], 0, "Dengan perkiraan 10%, konsumen primer menerima sekitar 10% energi produsen: 1.000 kJ."),
    soal("Jaring-jaring makanan berbeda dari rantai makanan karena jaring-jaring makanan ...", ["Hanya memiliki satu organisme", "Menghubungkan banyak rantai makanan dalam ekosistem", "Tidak menunjukkan hubungan makan", "Selalu berakhir pada tumbuhan"], 1, "Jaring-jaring makanan menunjukkan banyak hubungan makan yang saling terhubung."),
    soal("Organisme yang menguraikan sisa makhluk hidup menjadi zat sederhana antara lain ...", ["Elang dan harimau", "Rumput dan padi", "Bakteri dan jamur pengurai", "Belalang dan kupu-kupu saja"], 2, "Bakteri dan jamur pengurai memecah bahan organik dan mengembalikan unsur hara ke lingkungan."),
    soal("Dalam rantai padi → tikus → ular → elang, konsumen primer adalah ...", ["Padi", "Ular", "Elang", "Tikus"], 3, "Tikus memakan produsen berupa padi sehingga berperan sebagai konsumen primer."),
    soal("Pada rantai fitoplankton → zooplankton → ikan kecil → ikan besar, produsen adalah ...", ["Fitoplankton", "Zooplankton", "Ikan kecil", "Ikan besar"], 0, "Fitoplankton melakukan fotosintesis dan menjadi produsen pada rantai makanan perairan."),
    soal("Energi yang tersedia biasanya menurun pada tingkat trofik lebih tinggi karena ...", ["Energi bisa diciptakan oleh konsumen", "Sebagian energi digunakan untuk metabolisme dan hilang sebagai panas", "Semua organisme tidak bernapas", "Produsen tidak memperoleh energi"], 1, "Energi dipakai untuk aktivitas hidup dan banyak terlepas sebagai panas, sehingga tidak seluruhnya diteruskan ke tingkat berikutnya."),
    soal("Hewan yang memakan konsumen primer disebut ...", ["Produsen", "Pengurai primer", "Konsumen sekunder", "Autotrof"], 2, "Konsumen sekunder memakan konsumen primer dan biasanya berada pada tingkat trofik ketiga."),
    soal("Puncak rantai makanan biasanya ditempati oleh ...", ["Produsen", "Pengurai wajib", "Konsumen primer saja", "Predator tingkat tinggi"], 3, "Predator tingkat tinggi umumnya berada di bagian atas rantai makanan, walaupun rantai nyata dapat bervariasi."),
    soal("Piramida energi selalu berbentuk tegak karena ...", ["Energi yang tersedia berkurang pada setiap perpindahan trofik", "Jumlah energi bertambah tanpa batas", "Produsen tidak memerlukan energi", "Pengurai menciptakan energi"], 0, "Energi yang tersedia untuk tingkat trofik lebih tinggi selalu lebih sedikit daripada tingkat sebelumnya."),
    soal("Organisme detritivor memperoleh makanan terutama dari ...", ["Cahaya matahari langsung", "Serpihan bahan organik mati atau detritus", "Oksigen murni", "Batuan tanpa bahan organik"], 1, "Detritivor seperti cacing tanah memakan detritus dan membantu pemecahan bahan organik."),
    soal("Jika populasi ular menurun tajam dalam rantai padi → tikus → ular → elang, dampak yang mungkin terjadi adalah ...", ["Tikus pasti punah seketika", "Padi tidak lagi membutuhkan cahaya", "Populasi tikus dapat meningkat", "Semua organisme berubah menjadi produsen"], 2, "Berkurangnya predator dapat mengurangi tekanan pemangsaan sehingga populasi mangsa, seperti tikus, berpotensi naik."),
    soal("Pestisida persisten yang masuk ke rantai makanan dapat mencapai kadar tinggi pada predator puncak melalui ...", ["Fotosintesis", "Osmosis pada daun saja", "Transpirasi", "Biomagnifikasi"], 3, "Biomagnifikasi membuat konsentrasi beberapa pencemar persisten meningkat pada tingkat trofik yang lebih tinggi."),
    soal("Hubungan makan yang ditunjukkan oleh anak panah dalam rantai makanan biasanya mengarah dari ...", ["Organisme yang dimakan ke organisme pemakan", "Predator ke mangsanya sebagai arah energi", "Matahari ke tanah saja", "Pengurai ke bahan anorganik sebagai sumber energi utama"], 0, "Anak panah menunjukkan arah perpindahan energi dan materi, dari organisme yang dimakan menuju pemakannya."),
    soal("Pada rantai rumput → kelinci → rubah, rubah berperan sebagai ...", ["Produsen", "Konsumen sekunder", "Konsumen primer", "Pengurai"], 1, "Kelinci memakan rumput sebagai konsumen primer, sedangkan rubah yang memakan kelinci adalah konsumen sekunder."),
    soal("Pengurai penting dalam ekosistem karena ...", ["Menghentikan seluruh daur materi", "Menghasilkan cahaya matahari", "Mendaur ulang unsur hara dari bahan organik", "Mengubah semua energi menjadi materi baru"], 2, "Pengurai mengembalikan unsur seperti karbon, nitrogen, dan fosfor ke lingkungan agar dapat digunakan kembali."),
    soal("Jika produsen dalam ekosistem menurun tajam, dampak awal yang mungkin terjadi adalah ...", ["Semua konsumen langsung berfotosintesis", "Energi ekosistem bertambah", "Predator tidak membutuhkan mangsa", "Pasokan energi bagi konsumen berkurang"], 3, "Produsen merupakan dasar aliran energi pada sebagian besar rantai makanan, sehingga penurunannya dapat mengurangi energi bagi konsumen."),
    soal("Hewan omnivor dapat menempati lebih dari satu tingkat trofik karena ...", ["Memakan produsen dan konsumen", "Tidak memerlukan makanan", "Hanya memakan mineral", "Membuat makanan melalui fotosintesis"], 0, "Omnivor memakan bahan dari tumbuhan dan hewan, sehingga tingkat trofiknya dapat berbeda sesuai makanannya."),
  ],
  sejarahIslam: [
    soal('Siapakah nabi terakhir dalam Islam?', ['Nabi Isa', 'Nabi Musa', 'Nabi Muhammad ﷺ', 'Nabi Ibrahim'], 2, 'Nabi Muhammad ﷺ adalah penutup para nabi.'),
    soal('Di kota manakah Nabi Muhammad ﷺ dilahirkan?', ['Madinah', 'Makkah', 'Thaif', 'Yerusalem'], 1, 'Beliau lahir di Makkah.'),
    soal('Siapakah khalifah pertama setelah wafatnya Nabi Muhammad ﷺ?', ['Umar bin Khattab', 'Utsman bin Affan', 'Abu Bakar ash-Shiddiq', 'Ali bin Abi Thalib'], 2, 'Abu Bakar ash-Shiddiq menjadi khalifah pertama.'),
    soal('Nabi Muhammad ﷺ berhijrah dari Makkah menuju kota?', ['Madinah', 'Habasyah', 'Thaif', 'Damaskus'], 0, 'Hijrah Nabi ﷺ menuju Madinah (dahulu bernama Yatsrib).'),
    soal('Penanggalan Hijriah dihitung mulai dari peristiwa?', ['Perang Badar', 'Hijrah Nabi ke Madinah', 'Fathu Makkah', 'Wafatnya Nabi'], 1, 'Tahun 1 Hijriah dimulai dari hijrah Nabi ﷺ.'),
    soal('Wahyu pertama turun kepada Nabi ﷺ di gua?', ['Hira', 'Tsur', 'Kahfi', 'Safa'], 0, 'Wahyu pertama turun di Gua Hira.'),
    soal('Wahyu pertama yang turun adalah awal surah?', ['Al-Fatihah', "Al-'Alaq", 'Al-Baqarah', 'An-Nas'], 1, "Ayat 1–5 surah Al-'Alaq."),
    soal('Perang besar pertama antara kaum Muslimin dan Quraisy pada 2 H disebut?', ['Uhud', 'Khandaq', 'Badar', 'Hunain'], 2, 'Perang Badar terjadi pada 17 Ramadhan 2 H.'),
    soal('Siapakah istri pertama Nabi Muhammad ﷺ?', ['Aisyah', 'Khadijah', 'Hafshah', 'Ummu Salamah'], 1, 'Beliau menikah dengan Khadijah binti Khuwailid.'),
    soal('Khalifah yang dijuluki Al-Faruq adalah?', ['Abu Bakar', 'Umar bin Khattab', 'Utsman bin Affan', 'Ali bin Abi Thalib'], 1, 'Umar bin Khattab dijuluki Al-Faruq (pembeda antara yang hak dan batil).'),
    soal('Sahabat yang menemani Nabi ﷺ saat berhijrah ke Madinah adalah?', ['Abu Bakar ash-Shiddiq', 'Bilal bin Rabah', 'Khalid bin Walid', 'Zaid bin Tsabit'], 0, 'Abu Bakar menemani Nabi ﷺ, termasuk saat bersembunyi di Gua Tsur.'),
    soal('Di kota manakah Nabi Muhammad ﷺ wafat dan dimakamkan?', ['Makkah', 'Madinah', 'Kufah', 'Damaskus'], 1, 'Beliau wafat dan dimakamkan di Madinah.'),
    soal("Di kota manakah Nabi Muhammad ﷺ dilahirkan?", ["Madinah", "Makkah", "Thaif", "Yatsrib"], 1, "Nabi Muhammad ﷺ lahir di Makkah, di lingkungan Bani Hasyim dari suku Quraisy."),
    soal("Sekitar tahun berapakah Nabi Muhammad ﷺ dilahirkzzzzzzzzzzzzzzzzzzzzzan menurut kronologi yang umum digunakan?", ["570 M", "610 M", "622 M", "632 M"], 0, "Kelahiran beliau diperkirakan sekitar 570 M, yang dikenal sebagai Tahun Gajah."),
    soal("Nabi Muhammad ﷺ berasal dari keluarga Bani Hasyim yang merupakan bagian dari suku ....", ["Aus", "Khazraj", "Quraisy", "Tsaqif"], 2, "Bani Hasyim merupakan salah satu keluarga dalam suku Quraisy di Makkah."),
    soal("Siapakah ayah Nabi Muhammad ﷺ?", ["Abu Thalib", "Abdullah bin Abdul Muthalib", "Abdul Muthalib", "Abu Bakar ash-Shiddiq"], 1, "Ayah Nabi Muhammad ﷺ adalah Abdullah bin Abdul Muthalib."),
    soal("Siapakah ibu Nabi Muhammad ﷺ?", ["Aisyah binti Abu Bakar", "Halimah as-Sa'diyah", "Aminah binti Wahb", "Khadijah binti Khuwailid"], 2, "Ibu Nabi Muhammad ﷺ adalah Aminah binti Wahb."),
    soal("Menurut riwayat yang masyhur, apa yang terjadi pada ayah Nabi sebelum beliau lahir?", ["Berhijrah ke Madinah", "Wafat", "Menjadi pemimpin Quraisy", "Mengasuh beliau hingga remaja"], 1, "Menurut riwayat yang masyhur, Abdullah wafat sebelum Nabi Muhammad ﷺ dilahirkan."),
    soal("Di manakah Aminah wafat ketika Nabi Muhammad ﷺ masih kecil?", ["Badar", "Abwa", "Hudaibiyah", "Khaibar"], 1, "Aminah wafat di daerah Abwa ketika dalam perjalanan pulang dari Yatsrib."),
    soal("Kira-kira berapa usia Nabi Muhammad ﷺ ketika ibunya wafat?", ["Dua tahun", "Empat tahun", "Enam tahun", "Sepuluh tahun"], 2, "Kronologi sirah yang umum menyebut Nabi berusia sekitar enam tahun saat Aminah wafat."),
    soal("Siapakah yang mengasuh Nabi Muhammad ﷺ setelah ibunya wafat?", ["Abdul Muthalib", "Abu Lahab", "Abu Jahal", "Utsman bin Affan"], 0, "Setelah Aminah wafat, Nabi diasuh oleh kakeknya, Abdul Muthalib."),
    soal("Siapakah yang melanjutkan pengasuhan Nabi setelah Abdul Muthalib wafat?", ["Abu Thalib", "Abu Sufyan", "Abdullah bin Ubay", "Waraqah bin Nawfal"], 0, "Setelah Abdul Muthalib wafat sekitar 578 M, pengasuhan Nabi dilanjutkan oleh pamannya, Abu Thalib."),
    soal("Siapakah ibu susuan Nabi Muhammad ﷺ yang disebut dalam materi?", ["Sumayyah binti Khayyat", "Halimah as-Sa'diyah", "Ruqayyah binti Muhammad", "Asma binti Abu Bakar"], 1, "Halimah as-Sa'diyah dikenal sebagai ibu susuan Nabi Muhammad ﷺ."),
    soal("Pekerjaan yang pernah dilakukan Nabi Muhammad ﷺ pada masa muda adalah ....", ["Menggembala kambing", "Menjadi panglima Romawi", "Menjadi petani di Thaif", "Menjadi penulis kerajaan Habasyah"], 0, "Nabi Muhammad ﷺ pernah menggembala kambing dan juga terlibat dalam perjalanan perdagangan."),
    soal("Dengan siapa Nabi Muhammad ﷺ pernah mengikuti perjalanan perdagangan?", ["Pamannya", "Raja Najasyi", "Abu Jahal", "Malik bin Auf"], 0, "Pada masa muda, Nabi pernah ikut dalam perjalanan perdagangan bersama pamannya, Abu Thalib."),
    soal("Apa gelar Nabi Muhammad ﷺ yang berarti orang yang dapat dipercaya?", ["Al-Faruq", "Dzun Nurain", "Al-Amin", "Saifullah"], 2, "Al-Amin berarti orang yang dapat dipercaya; gelar ini dikenal dalam tradisi sirah tentang Nabi."),
    soal("Apa makna gelar Al-Amin?", ["Orang yang sangat kaya", "Orang yang dapat dipercaya", "Panglima perang", "Pemimpin para pedagang"], 1, "Al-Amin bermakna orang yang amanah dan dapat dipercaya."),
    soal("Sekitar tahun berapakah Nabi Muhammad ﷺ menikah dengan Khadijah binti Khuwailid?", ["570 M", "595 M", "610 M", "622 M"], 1, "Pernikahan Nabi Muhammad ﷺ dengan Khadijah diperkirakan berlangsung sekitar 595 M."),
    soal("Berapa kira-kira usia Nabi Muhammad ﷺ ketika menikah dengan Khadijah?", ["15 tahun", "20 tahun", "25 tahun", "40 tahun"], 2, "Kronologi sirah yang umum menyebut usia Nabi sekitar 25 tahun saat menikah dengan Khadijah."),
    soal("Khadijah binti Khuwailid dikenal sebagai perempuan yang menjalankan usaha ....", ["Pertanian", "Perdagangan", "Pembuatan senjata", "Pelayaran militer"], 1, "Khadijah adalah perempuan terpandang yang menjalankan usaha perdagangan."),
    soal("Apa peran penting Khadijah ketika Nabi Muhammad ﷺ menerima wahyu pertama?", ["Menentang dakwah beliau", "Memberikan dukungan dan membenarkan beliau", "Memimpin pasukan ke Madinah", "Menjadi utusan kepada Quraisy"], 1, "Khadijah memberikan dukungan besar dan menjadi orang pertama yang membenarkan pengalaman turunnya wahyu kepada Nabi."),
    soal("Perselisihan tentang Hajar Aswad terjadi ketika Ka'bah direnovasi sekitar tahun ....", ["570 M", "595 M", "605 M", "622 M"], 2, "Kisah penyelesaian sengketa Hajar Aswad umumnya ditempatkan sekitar 605 M, sebelum kenabian."),
    soal("Apa penyebab perselisihan para pemimpin Quraisy saat renovasi Ka'bah?", ["Penentuan pemimpin hijrah", "Perebutan hak meletakkan Hajar Aswad", "Pembagian hasil Perang Badar", "Penetapan kalender Hijriah"], 1, "Para pemimpin kabilah berselisih tentang siapa yang berhak meletakkan kembali Hajar Aswad."),
    soal("Bagaimana Nabi Muhammad ﷺ menyelesaikan perselisihan peletakan Hajar Aswad?", ["Memilih satu kabilah tanpa musyawarah", "Menggunakan selembar kain yang diangkat bersama", "Memindahkan Ka'bah ke tempat lain", "Menunda renovasi selama sepuluh tahun"], 1, "Beliau meletakkan Hajar Aswad di atas kain agar para pemimpin kabilah dapat mengangkatnya bersama-sama."),
    soal("Siapa yang ikut mengangkat kain berisi Hajar Aswad dalam penyelesaian sengketa itu?", ["Para pemimpin kabilah Quraisy", "Pasukan dari Habasyah", "Penduduk Yatsrib saja", "Para tawanan Perang Badar"], 0, "Para pemimpin kabilah Quraisy bersama-sama mengangkat kain tersebut."),
    soal("Siapa yang akhirnya meletakkan zzzzzzzHajar Aswad pada tempatnya?", ["Abu Thalib", "Abdul Muthalib", "Nabi Muhammad ﷺ", "Waraqah bin Nawfal"], 2, "Setelah kain diangkat bersama, Nabi Muhammad ﷺ sendiri meletakkan Hajar Aswad."),
    soal("Pelajaran utama dari penyelesaian sengketa Hajar Aswad adalah ....", ["Perselisihan hanya dapat diselesaikan dengan perang", "Kepercayaan dan penyelesaian damai dapat meredakan konflik", "Perdagangan harus dihentikan", "Semua kabilah harus meninggalkan Makkah"], 1, "Kisah ini menunjukkan kemampuan Nabi menyelesaikan perselisihan secara damai dan memperoleh kepercayaan masyarakat."),

    // BAGIAN 2 — AWAL KENABIAN DAN DAKWAH DI MAKKAH
    soal("Sekitar berapa usia Nabi Muhammad ﷺ ketika menerima wahyu pertama?", ["25 tahun", "30 tahun", "40 tahun", "63 tahun"], 2, "Nabi Muhammad ﷺ menerima wahyu pertama ketika berusia sekitar 40 tahun."),
    soal("Di manakah Nabi Muhammad ﷺ menerima wahyu pertama?", ["Gua Tsur", "Gua Hira", "Masjid Quba", "Lembah Hunain"], 1, "Wahyu pertama diterima ketika Nabi berkhalwat di Gua Hira."),
    soal("Malaikat yang menyampaikan wahyu pertama kepada Nabi Muhammad ﷺ adalah ....", ["Mikail", "Israfil", "Jibril", "Malik"], 2, "Dalam keyakinan Islam, Malaikat Jibril menyampaikan wahyu pertama kepada Nabi."),
    soal("Ayat yang masyhur dikaitkan dengan wahyu pertama adalah ....", ["QS Al-Fatihah ayat 1–7", "QS Al-'Alaq ayat 1–5", "QS Al-Ikhlas ayat 1–4", "QS Al-Kautsar ayat 1–3"], 1, "QS Al-'Alaq ayat 1–5 secara masyhur dikaitkan dengan peristiwa wahyu pertama."),
    soal("Wahyu pertama sekitar tahun 610 M menandai ....", ["Dimulainya masa kenabian", "Dimulainya kalender Hijriah", "Berakhirnya dakwah Islam", "Wafatnya Nabi Muhammad ﷺ"], 0, "Peristiwa di Gua Hira menandai awal kenabian dan turunnya Al-Qur'an."),
    soal("Siapakah yang memberikan dukungan kepada Nabi setelah beliau menceritakan pengalaman wahyu pertama?", ["Khadijah", "Abu Jahal", "Abu Lahab", "Abdullah bin Ubay"], 0, "Khadijah menguatkan dan mendukung Nabi setelah peristiwa wahyu pertama."),
    soal("Siapakah Waraqah bin Nawfal dalam kisah awal kenabian?", ["Pemimpin pasukan Quraisy", "Tokoh yang disebut dalam riwayat penjelasan awal wahyu", "Raja Madinah", "Pemimpin pasukan Hawazin"], 1, "Waraqah bin Nawfal sering disebut dalam riwayat mengenai penjelasan awal pengalaman wahyu Nabi."),
    soal("Dakwah Nabi secara sembunyi-sembunyi berlangsung sekitar ....", ["2 Tahun", "3 Tahun", "4 Tahun", "5 Tahun"], 0, "2 Tahun"),
    soal("Fokus utama dakwah Nabi pada periode Makkah adalah ....", ["Tauhid dan penyembahan hanya kepada Allah", "Perluasan wilayah melalui penaklukan", "Pembangunan armada laut", "Pengumpulan pajak kerajaan"], 0, "Dakwah Makkah menekankan tauhid, keimanan kepada hari akhir, akhlak, keadilan, dan tanggung jawab sosial."),
    soal("Siapakah sepupu Nabi yang termasuk orang-orang awal menerima Islam?", ["Ali bin Abi Thalib", "Abu Sufyan bin Harb", "Khalid bin Walid", "Suhail bin Amr"], 0, "Ali bin Abi Thalib termasuk orang-orang terdekat yang awal menerima Islam."),
    soal("Siapakah mantan budak yang dekat dengan Nabi dan termasuk Muslim awal?", ["Zaid bin Haritsah", "Abu Lahab", "Utbah bin Rabi'ah", "Ikrimah bin Abi Jahl"], 0, "Zaid bin Haritsah disebut sebagai salah seorang yang menerima Islam pada masa awal."),
    soal("Siapakah sahabat yang dikenal sebagai Abu Bakar ash-Shiddiq dan termasuk pendukung awal dakwah?", ["Abu Bakar", "Abu Jahal", "Abu Thalib", "Abu Sufyan"], 0, "Abu Bakar ash-Shiddiq termasuk orang-orang awal yang beriman dan mendukung dakwah Nabi."),
    soal("Sekitar tahun berapakah Nabi mulai menyampaikan dakwah secara terbuka di Makkah?", ["595 M", "605 M", "613 M", "632 M"], 2, "Dakwah secara terbuka dalam kronologi ini dimulai sekitar 613 M."),
    soal("Seruan utama dakwah terbuka Nabi kepada masyarakat Makkah adalah agar mereka ....", ["Meninggalkan penyembahan berhala dan mengesakan Allah", "Pindah ke Habasyah seluruhnya", "Menghentikan semua kegiatan perdagangan", "Membentuk pasukan menuju Romawi"], 0, "Dakwah terbuka menyeru masyarakat meninggalkan penyembahan berhala dan mengesakan Allah."),
    soal("Salah satu sebab penentangan Quraisy terhadap dakwah Nabi adalah karena dakwah itu ....", ["Mendukung penyembahan berhala", "Menantang kepercayaan lama dan tatanan sosial", "Melarang semua bentuk akhlak baik", "Mengharuskan semua orang menjadi pedagang"], 1, "Pesan tauhid menantang kepercayaan lama dan sejumlah tatanan sosial yang telah mapan di Makkah."),
    soal("Penganiayaan terhadap sebagian kaum Muslimin di Makkah meningkat sekitar ....", ["614–615 M", "622–623 M", "628–629 M", "631–632 M"], 0, "Kronologi menempatkan meningkatnya penganiayaan sekitar 614–615 M."),
    soal("Siapakah sahabat yang dikenal mengalami penyiksaan karena mempertahankan keimanannya dan disebut dalam materi?", ["Bilal bin Rabah", "Suhail bin Amr", "Sa'ad bin Rabi'", "Ka'ab bin Malik"], 0, "Bilal bin Rabah termasuk Muslim yang mengalami tekanan dan penganiayaan di Makkah."),
    soal("Siapakah perempuan dari keluarga Yasir yang disebut gugur dalam penganiayaan terhadap Muslim awal?", ["Sumayyah binti Khayyat", "Ruqayyah binti Muhammad", "Asma binti Abu Bakar", "Aisyah binti Abu Bakar"], 0, "Sumayyah binti Khayyat disebut dalam materi sebagai salah satu korban penganiayaan kaum Muslimin awal."),
    soal("Selain Bilal dan keluarga Yasir, siapa yang disebut mengalami tekanan di Makkah?", ["Khabbab bin al-Aratt", "Salman al-Farisi saat Khandaq", "Malik bin Auf", "Abdullah bin Jubair"], 0, "Khabbab bin al-Aratt disebut sebagai salah satu Muslim yang mengalami penganiayaan."),
    soal("Ke manakah hijrah pertama sebagian kaum Muslimin sekitar 615 M?", ["Mesir", "Habasyah", "Yaman", "Syam"], 1, "Sebagian kaum Muslimin berhijrah ke Habasyah untuk mencari perlindungan."),
    soal("Apa tujuan utama hijrah ke Habasyah?", ["Mencari perlindungan dari tekanan di Makkah", "Memulai perang terhadap Madinah", "Membangun Ka'bah baru", "Mengikuti Haji Wada'"], 0, "Hijrah ke Habasyah dilakukan agar kaum Muslimin memperoleh tempat yang lebih aman untuk beragama."),
    soal("Siapakah penguasa Habasyah yang dikenal memberikan perlindungan kepada kaum Muslimin?", ["Raja Najasyi", "Heraklius", "Abu Sufyan", "Malik bin Auf"], 0, "Raja Najasyi dikenal dalam tradisi Islam sebagai penguasa yang melindungi kaum Muslimin yang datang ke Habasyah."),
    soal("Pasangan yang disebut ikut dalam hijrah pertama ke Habasyah adalah ....", ["Utsman bin Affan dan Ruqayyah binti Muhammad", "Ali bin Abi Thalib dan Aisyah", "Abu Bakar dan Khadijah", "Hamzah dan Sumayyah"], 0, "Utsman bin Affan dan Ruqayyah binti Muhammad termasuk tokoh yang dikaitkan dengan hijrah ke Habasyah."),
    soal("Dalam salah satu riwayat, rombongan hijrah pertama ke Habasyah terdiri atas ....", ["11 laki-laki dan 4 perempuan", "12 laki-laki dan 12 perempuan", "73 laki-laki dan 2 perempuan", "313 laki-laki tanpa perempuan"], 0, "Salah satu riwayat menyebut kelompok pertama terdiri atas 11 laki-laki dan 4 perempuan; jumlah dapat berbeda antarriwayat."),
    soal("Menurut salah satu riwayat sirah, gelombang hijrah berikutnya ke Habasyah mencakup sekitar ....", ["83 laki-laki dan 18 perempuan", "11 laki-laki dan 4 perempuan", "700 laki-laki dan 300 perempuan", "1.400 laki-laki dan 100 perempuan"], 0, "Salah satu riwayat menyebut sekitar 83 laki-laki dan 18 perempuan; jumlah ini tidak disepakati sama oleh semua sumber."),

    // BAGIAN 3 — AKHIR PERIODE MAKKAH, AQABAH, HIJRAH, DAN MADINAH
    soal("Pemboikotan terhadap Bani Hasyim dan Bani Muthalib berlangsung kira-kira pada ....", ["610–613 M", "616–619 M", "622–625 M", "630–632 M"], 1, "Kronologi menempatkan pemboikotan terhadap Bani Hasyim dan Bani Muthalib sekitar 616–619 M."),
    soal("Apa bentuk tekanan dalam pemboikotan Bani Hasyim dan Bani Muthalib?", ["Tekanan sosial dan ekonomi", "Pemberian jabatan pemerintahan", "Perjanjian umrah", "Pembagian rampasan perang"], 0, "Pemboikotan merupakan tekanan sosial dan ekonomi terhadap kelompok yang melindungi Nabi."),
    soal("Dua tokoh yang wafat sekitar 619 M dan berkaitan dengan Tahun Kesedihan adalah ....", ["Khadijah dan Abu Thalib", "Abu Bakar dan Umar", "Hamzah dan Ja'far", "Utsman dan Ali"], 0, "Khadijah dan Abu Thalib wafat sekitar 619 M, sehingga tahun tersebut dikenal sebagai Tahun Kesedihan."),
    soal("Mengapa tahun sekitar 619 M dikenal sebagai 'Am al-Huzn?", ["Nabi menerima wahyu pertama", "Khadijah dan Abu Thalib wafat", "Perang Badar terjadi", "Ka'bah direnovasi"], 1, "'Am al-Huzn berarti Tahun Kesedihan, terkait wafatnya Khadijah dan Abu Thalib."),
    soal("Ke kota manakah Nabi pergi sekitar 620 M untuk mencari dukungan dakwah?", ["Khaibar", "Thaif", "Tabuk", "Habasyah"], 1, "Nabi melakukan perjalanan ke Thaif untuk mencari dukungan dakwah di luar Makkah."),
    soal("Bagaimana tanggapan para pemimpin Thaif terhadap dakwah Nabi saat kunjungan itu?", ["Menerima beliau tanpa penolakan", "Menolak dakwah beliau", "Mengangkat beliau sebagai raja", "Menyerahkan Madinah kepada beliau"], 1, "Perjalanan ke Thaif menghadapi penolakan dan belum menghasilkan dukungan yang diharapkan."),
    soal("Siapakah yang menemani Nabi dalam perjalanan ke Thaif menurut materi?", ["Zaid bin Haritsah", "Abu Jahal", "Suhail bin Amr", "Malik bin Auf"], 0, "Zaid bin Haritsah disebut menemani Nabi dalam perjalanan ke Thaif."),
    soal("Peristiwa Isra dan Mikraj dalam kronologi ini ditempatkan sekitar ....", ["595–596 M", "620–621 M", "624–625 M", "630–631 M"], 1, "Dalam kronologi yang disajikan, Isra dan Mikraj ditempatkan sekitar 620–621 M; tanggal persisnya diperselisihkan."),
    soal("Isra dalam peristiwa Isra dan Mikraj merujuk pada perjalanan malam ke ....", ["Masjidil Aqsa", "Gua Hira", "Gua Tsur", "Masjid Quba"], 0, "Isra merujuk pada perjalanan malam ke Masjidil Aqsa; setelahnya Nabi mengalami Mikraj."),
    soal("Peristiwa Isra dan Mikraj berkaitan erat dengan kewajiban ....", ["Zakat pertanian", "Salat", "Puasa Ramadan pertama", "Haji Wada'"], 1, "Isra dan Mikraj berkaitan dengan kewajiban salat dalam keyakinan Islam."),
    soal("Berapa jumlah peserta Baiat Aqabah pertama menurut riwayat yang masyhur?", ["12 orang", "40 orang", "73 orang", "313 orang"], 0, "Baiat Aqabah pertama sekitar 621 M diikuti 12 orang menurut riwayat yang masyhur."),
    soal("Siapakah sahabat yang diutus untuk mengajarkan Islam di Yatsrib setelah Baiat Aqabah pertama?", ["Mus'ab bin Umair", "Khalid bin Walid", "Abu Sufyan", "Amr bin Hisyam"], 0, "Mus'ab bin Umair diutus untuk mengajarkan Islam di Yatsrib setelah Baiat Aqabah pertama."),
    soal("Baiat Aqabah kedua berlangsung sekitar tahun ....", ["613 M", "619 M", "622 M", "630 M"], 2, "Baiat Aqabah kedua ditempatkan sekitar 622 M, menjelang hijrah Nabi ke Madinah."),
    soal("Menurut riwayat yang masyhur, Baiat Aqabah kedua diikuti sekitar ....", ["12 orang seluruhnya laki-laki", "73 laki-laki dan 2 perempuan", "313 laki-laki dan 14 perempuan", "1.400 laki-laki"], 1, "Riwayat yang masyhur menyebut sekitar 73 laki-laki dan 2 perempuan mengikuti Baiat Aqabah kedua."),
    soal("Salah satu arti penting Baiat Aqabah kedua adalah penduduk Yatsrib berjanji untuk ....", ["Melarang dakwah Islam", "Memberikan perlindungan kepada Nabi dan kaum Muslimin", "Menyerang Habasyah", "Memindahkan Ka'bah"], 1, "Baiat Aqabah kedua memberikan dasar perlindungan bagi Nabi dan kaum Muslimin di Yatsrib."),
    soal("Hijrah Nabi Muhammad ﷺ ke Madinah berlangsung pada ....", ["570 M / Tahun Gajah", "610 M / awal wahyu", "622 M / 1 H", "632 M / 11 H"], 2, "Hijrah ke Madinah berlangsung pada 622 M dan menjadi titik awal penanggalan Hijriah."),
    soal("Siapakah yang menyertai Nabi Muhammad ﷺ dalam perjalanan hijrah?", ["Abu Bakar ash-Shiddiq", "Abu Jahal", "Abu Lahab", "Utbah bin Rabi'ah"], 0, "Nabi Muhammad ﷺ berangkat menuju Madinah bersama Abu Bakar."),
    soal("Gua yang menjadi tempat singgah Nabi dan Abu Bakar saat hijrah adalah ....", ["Gua Hira", "Gua Tsur", "Gua Uhud", "Gua Badar"], 1, "Nabi dan Abu Bakar singgah di Gua Tsur dalam perjalanan hijrah."),
    soal("Sebelum memasuki Madinah, Nabi Muhammad ﷺ tiba di ....", ["Quba", "Khaibar", "Thaif", "Tabuk"], 0, "Dalam perjalanan hijrah, Nabi tiba di Quba sebelum memasuki Madinah."),
    soal("Masjid yang dibangun pada awal kedatangan Nabi di sekitar Madinah antara lain ....", ["Masjid Quba dan Masjid Nabawi", "Masjidil Haram dan Masjid al-Aqsa", "Masjid Khaibar dan Masjid Hunain", "Masjid Tabuk dan Masjid Thaif"], 0, "Masjid Quba dan Masjid Nabawi menjadi pusat penting bagi komunitas Muslim yang baru terbentuk."),
    soal("Selain sebagai tempat ibadah, masjid pada masa Nabi berfungsi sebagai pusat ....", ["Pendidikan, musyawarah, dan kehidupan masyarakat", "Pembuatan seluruh barang dagangan", "Penyimpanan semua hasil pertanian Jazirah Arab", "Pertandingan olahraga saja"], 0, "Masjid berfungsi untuk ibadah, pendidikan, musyawarah, dan kehidupan sosial masyarakat."),
    soal("Kaum Muslimin yang berhijrah dari Makkah ke Madinah disebut ....", ["Anshar", "Muhajirin", "Hawazin", "Ghatafan"], 1, "Muhajirin adalah kaum Muslimin yang berhijrah dari Makkah."),
    soal("Penduduk Madinah yang menolong kaum Muslimin yang berhijrah disebut ....", ["Muhajirin", "Anshar", "Quraisy", "Tsaqif"], 1, "Anshar adalah penduduk Madinah yang menolong dan menerima kaum Muhajirin."),
    soal("Apa tujuan persaudaraan antara Muhajirin dan Anshar?", ["Memperkuat solidaritas dan saling membantu", "Memisahkan semua penduduk Madinah", "Membentuk pasukan untuk menyerang Habasyah", "Menghentikan pendidikan agama"], 0, "Nabi mempersaudarakan Muhajirin dan Anshar untuk memperkuat persatuan dan dukungan sosial."),
    soal("Piagam Madinah terutama mengatur ....", ["Kehidupan bersama, tanggung jawab, dan hubungan antarkelompok", "Jumlah jamaah Haji Wada'", "Tata cara berdagang di Habasyah saja", "Pembagian benteng Khaibar"], 0, "Piagam Madinah merupakan kesepakatan untuk mengatur kehidupan bersama dan hubungan antarkelompok di Madinah."),

    // BAGIAN 4 — BADAR, UHUD, PERISTIWA TAHUN 4 H, DAN KHANDAQ
    soal("Perang Badar terjadi pada tanggal dan tahun yang umum disebutkan sebagai ....", ["17 Ramadan 2 H", "10 Muharam 1 H", "8 Ramadan 8 H", "9 Zulhijah 10 H"], 0, "Perang Badar umumnya ditempatkan pada 17 Ramadan tahun 2 H."),
    soal("Berapa jumlah pasukan Muslim yang umum disebut dalam Perang Badar?", ["Sekitar 100 orang", "Sekitar 313–317 orang", "Sekitar 3.000 orang", "Sekitar 30.000 orang"], 1, "Angka yang umum dikutip untuk pasukan Muslim di Badar adalah sekitar 313–317 orang."),
    soal("Berapa perkiraan jumlah pasukan Quraisy dalam Perang Badar menurut ringkasan materi?", ["Sekitar 300 orang", "Sekitar 700 orang", "Sekitar 1.000 orang", "Sekitar 10.000 orang"], 2, "Jumlah pasukan Quraisy di Badar sering diperkirakan sekitar 1.000 orang."),
    soal("Siapakah pemimpin kaum Muslimin dalam Perang Badar?", ["Nabi Muhammad ﷺ", "Abu Jahal", "Abu Sufyan", "Utbah bin Rabi'ah"], 0, "Nabi Muhammad ﷺ memimpin kaum Muslimin dalam Perang Badar."),
    soal("Siapakah tokoh Quraisy yang dikenal dengan nama Amr bin Hisyam dan terbunuh di Badar?", ["Abu Jahal", "Abu Thalib", "Abu Bakar", "Abu Dzar"], 0, "Amr bin Hisyam dikenal sebagai Abu Jahal dan termasuk tokoh penting pihak Quraisy di Badar."),
    soal("Apa hasil umum Perang Badar?", ["Kemenangan kaum Muslimin", "Pengepungan Madinah berhasil", "Makkah langsung dibebaskan", "Tidak ada pihak yang bertahan"], 0, "Kaum Muslimin meraih kemenangan dalam Perang Badar meskipun jumlah mereka lebih sedikit."),
    soal("Menurut riwayat yang masyhur, kira-kira berapa orang Quraisy terbunuh dan tertawan di Badar?", ["7 terbunuh dan 7 tertawan", "70 terbunuh dan 70 tertawan", "300 terbunuh dan 300 tertawan", "1.000 terbunuh dan tidak ada tawanan"], 1, "Angka yang sering dikutip adalah sekitar 70 orang Quraisy terbunuh dan 70 tertawan."),
    soal("Berapa jumlah kaum Muslimin yang gugur di Badar menurut riwayat yang masyhur?", ["14 orang", "40 orang", "70 orang", "100 orang"], 0, "Riwayat yang masyhur menyebut 14 Muslim gugur dalam Perang Badar."),
    soal("Salah satu dampak penting kemenangan Badar adalah ....", ["Menguatkan kedudukan masyarakat Muslim di Madinah", "Mengakhiri seluruh peristiwa sirah", "Membuat Nabi langsung berhijrah ke Habasyah", "Membubarkan masyarakat Madinah"], 0, "Kemenangan Badar memperkuat posisi komunitas Muslim Madinah dalam konflik dengan Quraisy."),
    soal("Perang Uhud berlangsung pada tahun ....", ["1 H", "2 H", "3 H", "8 H"], 2, "Perang Uhud terjadi pada tahun 3 H."),
    soal("Berapa jumlah pasukan Muslim yang menghadapi Quraisy di Uhud setelah sekitar 300 orang mundur?", ["Sekitar 100 orang", "Sekitar 313 orang", "Sekitar 700 orang", "Sekitar 3.000 orang"], 2, "Setelah sekitar 300 orang mundur, pasukan Muslim yang tersisa berjumlah sekitar 700 orang."),
    soal("Berapa perkiraan jumlah pasukan Quraisy pada Perang Uhud?", ["Sekitar 700 orang", "Sekitar 1.000 orang", "Sekitar 3.000 orang", "Sekitar 10.000 orang"], 2, "Pasukan Quraisy di Uhud sering diperkirakan sekitar 3.000 orang."),
    soal("Siapakah pemimpin kelompok pemanah Muslim yang disebut dalam Perang Uhud?", ["Abdullah bin Jubair", "Salman al-Farisi", "Mus'ab bin Umair", "Ja'far bin Abi Thalib"], 0, "Abdullah bin Jubair memimpin kelompok pemanah Muslim di Uhud."),
    soal("Faktor yang mengubah keadaan pertempuran Uhud adalah ketika sebagian pemanah ....", ["Meninggalkan posisi mereka", "Menyeberang ke Habasyah", "Menggali parit di sekitar Makkah", "Memulai perundingan Hudaibiyah"], 0, "Ketika sejumlah pemanah meninggalkan posisi, keadaan pertempuran berubah dan kaum Muslimin mengalami kerugian besar."),
    soal("Siapakah paman Nabi yang gugur dalam Perang Uhud?", ["Hamzah bin Abdul Muthalib", "Abu Thalib", "Abbas bin Abdul Muthalib", "Abdul Muthalib"], 0, "Hamzah bin Abdul Muthalib, paman Nabi, gugur di Uhud."),
    soal("Apa yang dialami Nabi Muhammad ﷺ dalam Perang Uhud?", ["Beliau terluka", "Beliau ditawan dan dibawa ke Habasyah", "Beliau memimpin Haji Wada'", "Beliau menandatangani Piagam Madinah"], 0, "Nabi Muhammad ﷺ mengalami luka dalam pertempuran Uhud."),
    soal("Menurut angka yang umum disebut, berapa Muslim gugur di Uhud?", ["14 orang", "30 orang", "Sekitar 70 orang", "Sekitar 300 orang"], 2, "Sekitar 70 Muslim gugur di Uhud menurut riwayat sirah yang umum dikutip."),
    soal("Apa gambaran hasil Perang Uhud dalam ringkasan materi?", ["Quraisy memperoleh keberhasilan di medan perang, tetapi tidak mengakhiri komunitas Muslim", "Kaum Muslimin langsung menguasai seluruh Syam", "Quraisy menyerah tanpa bertempur", "Madinah ditinggalkan seluruh penduduknya"], 0, "Quraisy memperoleh keberhasilan di medan perang, tetapi tidak berhasil mengakhiri keberadaan komunitas Muslim di Madinah."),
    soal("Pelajaran yang ditekankan dari Perang Uhud adalah pentingnya ....", ["Disiplin dan ketaatan pada kepemimpinan", "Jumlah besar selalu menjamin kemenangan", "Mengabaikan strategi pertahanan", "Menolak semua perjanjian"], 0, "Peristiwa Uhud sering diambil sebagai pelajaran mengenai disiplin, ketaatan, dan kesiapan menghadapi perubahan situasi."),
    soal("Tragedi ar-Raji' dan Bi'r Ma'unah yang melibatkan terbunuhnya sejumlah Muslim ditempatkan sekitar ....", ["4 H", "1 H", "8 H", "11 H"], 0, "Dalam kronologi yang diberikan, ar-Raji' dan Bi'r Ma'unah ditempatkan pada tahun 4 H."),
    soal("Peristiwa yang berakhir dengan pengusiran Bani Nadhir dari Madinah menurut ringkasan sirah terjadi sekitar ....", ["4 H", "2 H", "7 H", "10 H"], 0, "Materi menempatkan berakhirnya konflik dengan Bani Nadhir dan pengusiran kelompok tersebut sekitar 4 H."),
    soal("Perang Khandaq atau Ahzab terjadi pada tahun ....", ["2 H", "3 H", "5 H", "9 H"], 2, "Perang Khandaq atau Ahzab terjadi pada tahun 5 H."),
    soal("Berapa perkiraan jumlah pasukan Muslim dalam Perang Khandaq?", ["Sekitar 700 orang", "Sekitar 1.400 orang", "Sekitar 3.000 orang", "Sekitar 30.000 orang"], 2, "Jumlah pasukan Muslim di Khandaq sering disebut sekitar 3.000 orang."),
    soal("Berapa perkiraan jumlah pasukan koalisi dalam Perang Khandaq menurut sebagian sumber?", ["Sekitar 1.000 orang", "Sekitar 3.000 orang", "Sekitar 7.500–10.000 orang", "Sekitar 100.000–200.000 orang"], 2, "Pasukan koalisi di Khandaq diperkirakan sekitar 7.500–10.000 orang dalam berbagai kajian."),
    soal("Siapakah sahabat yang dikaitkan dengan usulan menggali parit untuk mempertahankan Madinah?", ["Salman al-Farisi", "Bilal bin Rabah", "Zaid bin Haritsah", "Utsman bin Affan"], 0, "Salman al-Farisi dikaitkan dengan usulan menggali parit di bagian Madinah yang terbuka terhadap serangan."),

    // BAGIAN 5 — HUDAIBIYAH, KHAIBAR, MU'TAH, FATHU MAKKAH, DAN HUNAIN
    soal("Perjanjian Hudaibiyah terjadi pada tahun ....", ["2 H", "5 H", "6 H", "9 H"], 2, "Perjanjian Hudaibiyah terjadi pada 6 H, sekitar 628 M."),
    soal("Apa tujuan awal rombongan Nabi menuju Makkah pada peristiwa Hudaibiyah?", ["Melaksanakan umrah", "Memulai Perang Badar", "Menggali parit", "Menghadiri Haji Wada'"], 0, "Nabi dan para sahabat berangkat untuk melaksanakan umrah, bukan untuk memulai pertempuran."),
    soal("Berapa jumlah rombongan Muslim yang umum disebut dalam Perjanjian Hudaibiyah?", ["Sekitar 313 orang", "Sekitar 700 orang", "Sekitar 1.400 orang", "Sekitar 30.000 orang"], 2, "Riwayat populer menyebut sekitar 1.400 orang, meskipun terdapat riwayat yang menyebut angka berbeda seperti 1.500."),
    soal("Siapakah sahabat yang diutus sebagai wakil Nabi kepada Quraisy dalam konteks Hudaibiyah?", ["Utsman bin Affan", "Abdullah bin Jubair", "Malik bin Auf", "Sa'ad bin Rabi'"], 0, "Utsman bin Affan diutus sebagai wakil Nabi kepada pihak Quraisy."),
    soal("Siapakah wakil Quraisy yang disebut dalam perundingan Hudaibiyah?", ["Suhail bin Amr", "Abu Thalib", "Abdul Muthalib", "Ja'far bin Abi Thalib"], 0, "Suhail bin Amr disebut sebagai wakil Quraisy dalam perundingan Hudaibiyah."),
    soal("Apa yang terjadi dengan pelaksanaan umrah rombongan Muslim pada tahun Hudaibiyah?", ["Langsung dilaksanakan tanpa kesepakatan", "Belum dapat dilaksanakan pada tahun itu", "Dibatalkan untuk selamanya", "Dipindahkan ke Habasyah"], 1, "Dalam kesepakatan Hudaibiyah, kaum Muslimin belum dapat melaksanakan umrah pada tahun itu."),
    soal("Baiat ar-Ridhwan berlangsung dalam konteks kabar mengenai ....", ["Utsman bin Affan", "Abu Jahal", "Salman al-Farisi", "Malik bin Auf"], 0, "Baiat ar-Ridhwan berlangsung ketika beredar berita mengenai Utsman bin Affan."),
    soal("Salah satu dampak Perjanjian Hudaibiyah adalah ....", ["Terbukanya ruang lebih luas bagi dakwah dan komunikasi", "Langsung berakhirnya seluruh konflik di Jazirah Arab", "Berpindahnya ibu kota ke Habasyah", "Terjadinya perang besar di lokasi perundingan"], 0, "Gencatan senjata memberi ruang bagi dakwah, komunikasi antarkelompok, dan perkembangan hubungan politik."),
    soal("Peristiwa Khaibar berlangsung pada tahun ....", ["3 H", "5 H", "7 H", "11 H"], 2, "Peristiwa Khaibar berlangsung pada 7 H, sekitar 628–629 M."),
    soal("Berapa perkiraan jumlah pasukan Muslim dalam ekspedisi Khaibar menurut berbagai riwayat?", ["Sekitar 100–200 orang", "Sekitar 700 orang", "Sekitar 1.400–1.800 orang", "Sekitar 30.000 orang"], 2, "Jumlah pasukan Muslim dalam Khaibar diperkirakan sekitar 1.400–1.800 orang, bergantung pada sumber."),
    soal("Sahabat yang dikenal sebagai tokoh penting dalam peristiwa Khaibar adalah ....", ["Ali bin Abi Thalib", "Abu Lahab", "Amr bin Hisyam", "Abdullah bin Ubay"], 0, "Ali bin Abi Thalib disebut sebagai salah satu tokoh penting dalam peristiwa Khaibar."),
    soal("Mengapa Khaibar dikenal memiliki pertahanan yang kuat?", ["Wilayah itu memiliki sejumlah benteng", "Wilayah itu berada di tengah laut", "Semua penduduknya telah berhijrah ke Makkah", "Tidak ada permukiman di sana"], 0, "Konflik Khaibar berlangsung di kawasan yang mempunyai sejumlah benteng."),
    soal("Salah satu bentuk kesepakatan setelah sejumlah benteng Khaibar dikuasai berkaitan dengan ....", ["Pengelolaan lahan dan hasil pertanian", "Pengiriman jamaah Haji Wada'", "Pembagian wilayah Habasyah", "Pembangunan Gua Hira"], 0, "Setelah sejumlah benteng dikuasai, dibuat kesepakatan mengenai pengelolaan lahan dan hasil pertanian."),
    soal("Umrah al-Qadha dilakukan pada tahun ....", ["2 H", "5 H", "7 H", "10 H"], 2, "Umrah al-Qadha dilaksanakan pada 7 H, pada tahun setelah kesepakatan Hudaibiyah."),
    soal("Umrah al-Qadha menjadi bukti bahwa Perjanjian Hudaibiyah ....", ["Membuka jalan bagi pelaksanaan umrah pada tahun berikutnya", "Menghapus kewajiban salat", "Menyebabkan hijrah pertama ke Habasyah", "Mengakhiri masa kenabian"], 0, "Pada tahun berikutnya, Nabi dan para sahabat melaksanakan umrah sesuai ketentuan perjanjian."),
    soal("Perang Mu'tah berlangsung pada tahun ....", ["2 H", "5 H", "8 H", "10 H"], 2, "Ekspedisi Mu'tah berlangsung pada 8 H, sekitar 629 M."),
    soal("Berapa jumlah pasukan Muslim yang umum disebut dalam ekspedisi Mu'tah?", ["Sekitar 313 orang", "Sekitar 700 orang", "Sekitar 3.000 orang", "Sekitar 30.000 orang"], 2, "Jumlah pasukan Muslim dalam Mu'tah umumnya disebut sekitar 3.000 orang."),
    soal("Urutan tiga pemimpin Muslim yang gugur dalam Mu'tah menurut materi adalah ....", ["Zaid bin Haritsah, Ja'far bin Abi Thalib, Abdullah bin Rawahah", "Abu Bakar, Umar, Utsman", "Hamzah, Mus'ab, Salman", "Ali, Khalid, Zubair"], 0, "Tiga pemimpin yang ditunjuk gugur secara berurutan: Zaid bin Haritsah, Ja'far bin Abi Thalib, dan Abdullah bin Rawahah."),
    soal("Siapakah yang kemudian memimpin sisa pasukan Muslim untuk kembali dari Mu'tah?", ["Khalid bin Walid", "Abu Jahal", "Suhail bin Amr", "Abdullah bin Ubay"], 0, "Setelah tiga pemimpin gugur, Khalid bin Walid memimpin sisa pasukan untuk kembali."),
    soal("Bagaimana sebaiknya angka besar pasukan lawan dalam sejumlah riwayat Mu'tah dipahami?", ["Sebagai angka pasti yang telah disensus modern", "Sebagai angka yang diperdebatkan dan tidak pasti", "Sebagai jumlah pasukan Muslim", "Sebagai jumlah jamaah umrah"], 1, "Angka 100.000–200.000 dalam sebagian riwayat dipandang meragukan oleh sejumlah sejarawan modern."),
    soal("Fathu Makkah atau Pembebasan Makkah terjadi pada ....", ["Ramadan 8 H", "Ramadan 2 H", "Zulhijah 10 H", "Muharam 11 H"], 0, "Fathu Makkah terjadi pada Ramadan 8 H, sekitar 630 M."),
    soal("Berapa jumlah pasukan Muslim yang umum disebut dalam Fathu Makkah?", ["Sekitar 700 orang", "Sekitar 1.400 orang", "Sekitar 3.000 orang", "Sekitar 10.000 orang"], 3, "Jumlah pasukan Muslim dalam Fathu Makkah umumnya disebut sekitar 10.000 orang."),
    soal("Peristiwa yang menjadi bagian penting dari sebab Fathu Makkah adalah serangan Bani Bakr terhadap ....", ["Bani Khuza'ah", "Bani Hasyim", "Bani Nadhir", "Bani Muthalib"], 0, "Serangan Bani Bakr terhadap Bani Khuza'ah, sekutu Muslim, menjadi bagian penting dari pelanggaran kesepakatan Hudaibiyah."),
    soal("Sikap Nabi setelah Makkah dikuasai ditandai antara lain oleh ....", ["Pengampunan umum kepada banyak penduduk dan pembersihan Ka'bah dari berhala", "Pengusiran seluruh penduduk tanpa pengecualian", "Pembakaran Ka'bah", "Penghentian dakwah Islam"], 0, "Setelah Makkah dikuasai dengan perlawanan terbatas, Nabi memberikan pengampunan umum kepada banyak penduduk dan membersihkan Ka'bah dari berhala."),
    soal("Perang Hunain berlangsung tidak lama setelah Fathu Makkah, pada tahun ....", ["3 H", "5 H", "8 H", "11 H"], 2, "Hunain berlangsung pada Syawal 8 H setelah Fathu Makkah."),

    // BAGIAN 6 — HUNAIN, TABUK, HAJI WADA', WAFAT, DAN RANGKUMAN
    soal("Berapa perkiraan jumlah pasukan Muslim dalam Perang Hunain?", ["Sekitar 700 orang", "Sekitar 3.000 orang", "Sekitar 12.000 orang", "Sekitar 30.000 orang"], 2, "Pasukan Muslim di Hunain sering disebut sekitar 12.000 orang: kira-kira 10.000 dari Madinah dan 2.000 dari Makkah."),
    soal("Kelompok yang dihadapi kaum Muslimin dalam Perang Hunain adalah ....", ["Hawazin dan Tsaqif", "Aus dan Khazraj saja", "Bani Hasyim dan Bani Muthalib", "Najasyi dan pasukan Habasyah"], 0, "Di Hunain, kaum Muslimin menghadapi Hawazin dan Tsaqif."),
    soal("Siapakah pemimpin pasukan Hawazin yang disebut dalam materi Perang Hunain?", ["Malik bin Auf an-Nashri", "Suhail bin Amr", "Abdullah bin Jubair", "Waraqah bin Nawfal"], 0, "Malik bin Auf an-Nashri disebut sebagai pemimpin pasukan Hawazin."),
    soal("Apa yang terjadi pada awal Perang Hunain?", ["Pasukan Muslim sempat mengalami kekacauan akibat serangan mendadak", "Pasukan Muslim langsung menyerah", "Perjanjian damai ditandatangani tanpa pertempuran", "Madinah langsung dikepung selama berbulan-bulan"], 0, "Pada awal pertempuran Hunain, kaum Muslimin mengalami kekacauan akibat serangan mendadak, kemudian berkumpul kembali."),
    soal("Apa hasil akhir Perang Hunain dalam ringkasan materi?", ["Kemenangan kaum Muslimin", "Kemenangan Quraisy di Badar", "Pembebasan Makkah terjadi sebelum pertempuran itu", "Tidak ada pihak yang menang karena tidak bertempur"], 0, "Kaum Muslimin berkumpul kembali dan meraih kemenangan dalam Perang Hunain."),
    soal("Pelajaran yang sering ditarik dari Perang Hunain adalah ....", ["Jumlah pasukan besar tidak otomatis menjamin kemenangan", "Pasukan kecil selalu kalah", "Perjanjian tidak pernah bermanfaat", "Benteng selalu lebih penting daripada kepemimpinan"], 0, "Hunain menunjukkan bahwa jumlah pasukan yang besar tidak otomatis menjamin kemenangan."),
    soal("Apa yang dilakukan pasukan Muslim setelah Perang Hunain terhadap Thaif?", ["Melakukan pengepungan, tetapi tidak berhasil menguasai kota saat itu", "Langsung menetapkan Thaif sebagai ibu kota", "Berangkat ke Habasyah", "Menandatangani Piagam Madinah"], 0, "Setelah Hunain, pasukan Muslim mengepung Thaif, tetapi tidak berhasil menguasainya dalam ekspedisi tersebut."),
    soal("Pada tahun berapakah Ekspedisi Tabuk berlangsung?", ["2 H", "5 H", "8 H", "9 H"], 3, "Ekspedisi Tabuk berlangsung pada 9 H, sekitar 630 M."),
    soal("Berapa jumlah pasukan Muslim yang umum disebut dalam Ekspedisi Tabuk?", ["Sekitar 700 orang", "Sekitar 3.000 orang", "Sekitar 12.000 orang", "Sekitar 30.000 orang"], 3, "Jumlah pasukan Tabuk dalam literatur sirah sering disebut sekitar 30.000 orang; angka ini merupakan perkiraan tradisional."),
    soal("Apa kondisi yang membuat perjalanan menuju Tabuk berat?", ["Cuaca dan perjalanan yang sulit", "Perjalanan dilakukan sepenuhnya melalui laut", "Semua jalur telah tertutup salju", "Pasukan harus menyeberangi Samudra Hindia"], 0, "Pasukan Muslim menempuh perjalanan panjang ke utara dalam keadaan cuaca dan perjalanan yang berat."),
    soal("Apa yang terjadi antara pasukan Muslim dan pasukan Bizantium di Tabuk menurut materi?", ["Terjadi pertempuran besar yang menentukan", "Tidak terjadi pertempuran besar di Tabuk", "Pasukan Muslim ditawan seluruhnya", "Pasukan Muslim menyerang Habasyah"], 1, "Tidak terjadi pertempuran besar dengan pasukan Bizantium di Tabuk menurut kronologi yang disajikan."),
    soal("'Am al-Wufud atau Tahun Delegasi terutama dikenal sebagai masa ketika ....", ["Berbagai delegasi kabilah datang menemui Nabi", "Seluruh kaum Muslimin berhijrah ke Habasyah", "Perang Badar berlangsung", "Ka'bah direnovasi"], 0, "Pada 9 H, berbagai delegasi kabilah datang untuk membahas hubungan dan penerimaan Islam."),
    soal("Mengapa Tahun Delegasi bukan terutama dicatat sebagai sebuah perang?", ["Karena peristiwa utamanya adalah kedatangan delegasi, bukan satu pertempuran", "Karena tidak ada kabilah di Jazirah Arab", "Karena Nabi belum berada di Madinah", "Karena semua pasukan telah dibubarkan sejak 2 H"], 0, "Tahun Delegasi merupakan periode penerimaan delegasi dan pembahasan hubungan; tidak ada satu angka pasukan yang relevan."),
    soal("Haji Wada' atau Haji Perpisahan dilaksanakan pada tahun ....", ["6 H", "7 H", "9 H", "10 H"], 3, "Nabi Muhammad ﷺ melaksanakan Haji Wada' pada tahun 10 H, sekitar 632 M."),
    soal("Di manakah Nabi menyampaikan khotbah yang terkenal dalam Haji Wada'?", ["Arafah", "Gua Hira", "Benteng Khaibar", "Lembah Badar"], 0, "Khotbah Haji Wada' dikenal disampaikan Nabi di Arafah."),
    soal("Salah satu pokok penting dalam ajaran yang disampaikan pada masa Haji Wada' adalah ....", ["Penghormatan terhadap kehidupan dan harta manusia", "Kewajiban menyembah berhala", "Larangan menjaga amanah", "Penghapusan tanggung jawab moral"], 0, "Pokok ajaran yang disebut meliputi penghormatan terhadap kehidupan dan harta, amanah, serta perlakuan baik kepada orang lain."),
    soal("Berapa jumlah jamaah Haji Wada' yang sering disebut dalam sumber tradisional, dengan catatan angka pastinya tidak dapat dipastikan?", ["Sekitar 1.400 orang", "Sekitar 12.000 orang", "Sekitar 30.000 orang", "Sekitar 100.000 orang"], 3, "Sejumlah sumber tradisional menyebut sekitar 100.000 jamaah atau lebih, tetapi jumlah pasti tidak dapat dipastikan."),
    soal("Menjelang wafatnya Nabi, siapa yang memimpin salat ketika beliau tidak mampu memimpin sendiri?", ["Abu Bakar ash-Shiddiq", "Abu Jahal", "Malik bin Auf", "Suhail bin Amr"], 0, "Ketika Nabi sakit menjelang wafat dan tidak mampu memimpin sendiri, Abu Bakar memimpin salat."),
    soal("Nabi Muhammad ﷺ wafat pada tahun ....", ["2 H", "6 H", "9 H", "11 H"], 3, "Nabi Muhammad ﷺ wafat di Madinah pada tahun 11 H, yang dikonversi ke 632 M."),
    soal("Di kota manakah Nabi Muhammad ﷺ wafat?", ["Makkah", "Madinah", "Thaif", "Habasyah"], 1, "Nabi Muhammad ﷺ wafat di Madinah."),
    soal("Di manakah Nabi Muhammad ﷺ dimakamkan?", ["Di Gua Hira", "Di kamar Aisyah yang kemudian berada dalam kompleks Masjid Nabawi", "Di dekat Ka'bah", "Di Quba di luar Madinah"], 1, "Beliau dimakamkan di kamar Aisyah, yang kemudian berada dalam kompleks Masjid Nabawi."),
    soal("Tanggal wafat Nabi yang populer dalam banyak kitab sirah adalah 12 Rabiul Awal, tetapi ....", ["Tidak ada perbedaan pendapat sama sekali", "Hari persisnya masih diperselisihkan", "Tanggal itu menunjuk Perang Badar", "Tanggal itu adalah hari hijrah pertama ke Habasyah"], 1, "Tanggal 12 Rabiul Awal populer dalam banyak kitab sirah, namun terdapat perbedaan pendapat tentang hari persisnya."),
    soal("Berapa usia Nabi Muhammad ﷺ ketika wafat menurut hitungan tahun Hijriah yang umum disebut?", ["40 tahun", "53 tahun", "63 tahun", "70 tahun"], 2, "Usia Nabi ketika wafat secara umum disebut 63 tahun Hijriah."),
    soal("Periode Madinah dalam kehidupan Nabi dimulai dengan hijrah pada 622 M dan berakhir pada ....", ["Wafatnya Nabi pada 632 M", "Perang Badar pada 624 M", "Perjanjian Hudaibiyah pada 628 M", "Perang Uhud pada 625 M"], 0, "Periode Madinah dimulai dengan hijrah pada 622 M dan berakhir dengan wafatnya Nabi pada 632 M."),
    soal("Berapa lama kira-kira masa dakwah Nabi, dengan pembagian periode Makkah dan Madinah?", ["10 tahun: 5 Makkah dan 5 Madinah", "13 tahun Makkah dan 10 tahun Madinah, total sekitar 23 tahun", "30 tahun di Makkah saja", "63 tahun seluruhnya adalah masa dakwah setelah hijrah"], 1, "Masa dakwah berlangsung sekitar 23 tahun: 13 tahun periode Makkah dan 10 tahun periode Madinah."),
    soal('Siapakah empat khalifah yang dikenal sebagai Khulafaur Rasyidin?', ['Abu Bakar, Umar, Utsman, dan Ali', 'Muawiyah, Yazid, Marwan, dan Umar bin Abdul Aziz', 'Hamzah, Abbas, Ja\'far, dan Zaid', 'Talhah, Zubair, Khalid, dan Bilal'], 0, 'Khulafaur Rasyidin adalah Abu Bakar ash-Shiddiq, Umar bin Khattab, Utsman bin Affan, dan Ali bin Abi Thalib.'),
  soal('Dalam periodisasi sejarah Islam yang umum digunakan, masa Khulafaur Rasyidin berlangsung sekitar ...', ['570–610 M', '622–632 M', '632–661 M', '661–750 M'], 2, 'Masa Khulafaur Rasyidin umumnya ditempatkan pada 632–661 M, sekitar 29 tahun.'),
  soal('Siapakah khalifah pertama setelah wafatnya Nabi Muhammad ﷺ?', ['Umar bin Khattab', 'Abu Bakar ash-Shiddiq', 'Utsman bin Affan', 'Ali bin Abi Thalib'], 1, 'Abu Bakar ash-Shiddiq menjadi khalifah pertama setelah Nabi Muhammad ﷺ wafat.'),
  soal('Urutan khalifah yang benar adalah ...', ['Umar, Abu Bakar, Ali, Utsman', 'Abu Bakar, Utsman, Umar, Ali', 'Ali, Utsman, Abu Bakar, Umar', 'Abu Bakar, Umar, Utsman, Ali'], 3, 'Urutan yang umum digunakan ialah Abu Bakar, Umar, Utsman, kemudian Ali.'),
  soal('Pada rentang tahun berapakah Abu Bakar memimpin sebagai khalifah menurut ringkasan?', ['632–634 M', '634–644 M', '644–656 M', '656–661 M'], 0, 'Abu Bakar memimpin pada 632–634 M, sekitar dua tahun.'),
  soal('Khalifah yang memimpin pada 634–644 M adalah ...', ['Ali bin Abi Thalib', 'Utsman bin Affan', 'Umar bin Khattab', 'Abu Bakar ash-Shiddiq'], 2, 'Umar bin Khattab adalah khalifah kedua dan memimpin pada 634–644 M.'),
  soal('Siapakah khalifah yang memimpin sekitar 644–656 M?', ['Abu Bakar ash-Shiddiq', 'Utsman bin Affan', 'Ali bin Abi Thalib', 'Umar bin Khattab'], 1, 'Utsman bin Affan memimpin sebagai khalifah ketiga pada sekitar 644–656 M.'),
  soal('Ali bin Abi Thalib memimpin pada rentang ...', ['610–622 M', '632–634 M', '644–656 M', '656–661 M'], 3, 'Ali bin Abi Thalib menjadi khalifah keempat pada 656–661 M.'),
  soal('Periode Khulafaur Rasyidin berakhir setelah peristiwa apa?', ['Hasan bin Ali mencapai kesepakatan damai dengan Muawiyah', 'Pertempuran Yarmuk', 'Pengumpulan suhuf pertama kali', 'Penetapan kalender Hijriah'], 0, 'Kesepakatan damai Hasan bin Ali dengan Muawiyah menandai peralihan menuju Dinasti Umayyah dalam periodisasi umum.'),
  soal('Mengapa tanggal dan jumlah pasukan dalam sejarah Khulafaur Rasyidin perlu dibaca dengan hati-hati?', ['Semua catatan berasal dari sensus modern', 'Tidak ada sumber sejarah sama sekali', 'Sebagian angka dan tanggal merupakan perkiraan serta berbeda antarriwayat', 'Semua peristiwa berlangsung pada tahun yang sama'], 2, 'Sebagian tanggal dan jumlah pasukan merupakan perkiraan atau berbeda menurut riwayat sejarah.'),

  // B. Abu Bakar ash-Shiddiq
  soal('Apa tantangan utama Abu Bakar setelah menjadi khalifah?', ['Membangun armada laut untuk melawan Bizantium', 'Mempertahankan persatuan umat setelah wafatnya Nabi', 'Memimpin Perang Shiffin', 'Memindahkan ibu kota ke Kufah'], 1, 'Abu Bakar menghadapi tantangan menjaga kesatuan komunitas Muslim setelah Nabi wafat.'),
  soal('Bagaimana Abu Bakar diangkat menjadi khalifah?', ['Melalui pewarisan langsung dari Utsman', 'Melalui dewan syura enam tokoh', 'Melalui musyawarah di Saqifah, kemudian baiat', 'Melalui tahkim dengan Muawiyah'], 2, 'Pengangkatan Abu Bakar berlangsung melalui musyawarah di Saqifah yang diikuti baiat.'),
  soal('Ekspedisi siapa yang tetap dikirim Abu Bakar sesuai rencana yang telah disiapkan pada masa Nabi?', ['Ekspedisi Usamah bin Zaid', 'Ekspedisi Amr bin al-\'Ash ke Mesir', 'Ekspedisi Tabuk', 'Ekspedisi Khaibar'], 0, 'Abu Bakar mempertahankan rencana pengiriman pasukan Usamah bin Zaid yang telah disiapkan pada masa Nabi.'),
  soal('Perang Riddah berlangsung terutama pada masa khalifah ...', ['Ali bin Abi Thalib', 'Utsman bin Affan', 'Umar bin Khattab', 'Abu Bakar ash-Shiddiq'], 3, 'Perang Riddah berlangsung pada masa Abu Bakar, sekitar 632–633 M.'),
  soal('Apa yang dimaksud dengan Perang Riddah dalam ringkasan tersebut?', ['Perang melawan Bizantium di Syam', 'Konflik dengan kelompok yang memberontak, menolak kewajiban tertentu, atau mengikuti nabi palsu', 'Perang laut melawan Persia', 'Pertempuran antara Ali dan Muawiyah'], 1, 'Perang Riddah melibatkan kelompok-kelompok dengan latar belakang beragam, termasuk pemberontakan dan klaim kenabian.'),
  soal('Pertempuran yang berkaitan dengan banyaknya penghafal Al-Qur\'an gugur sehingga muncul usul pengumpulan Al-Qur\'an adalah ...', ['Yarmuk', 'Nahrawan', 'Yamamah', 'Jamal'], 2, 'Setelah pertempuran Yamamah, gugurnya sejumlah penghafal Al-Qur\'an mendorong usul pengumpulan catatan Al-Qur\'an.'),
  soal('Siapakah yang mengusulkan kepada Abu Bakar agar Al-Qur\'an dikumpulkan setelah pertempuran Yamamah?', ['Khalid bin Walid', 'Umar bin Khattab', 'Zaid bin Tsabit', 'Muawiyah bin Abi Sufyan'], 1, 'Umar bin Khattab mengusulkan pengumpulan Al-Qur\'an setelah banyak penghafal gugur.'),
  soal('Siapakah yang ditugaskan Abu Bakar untuk menghimpun catatan Al-Qur\'an menjadi suhuf?', ['Zaid bin Tsabit', 'Amr bin al-\'Ash', 'Sa\'ad bin Abi Waqqas', 'Abu Ubaidah bin al-Jarrah'], 0, 'Abu Bakar menugaskan Zaid bin Tsabit untuk menghimpun catatan Al-Qur\'an menjadi suhuf.'),
  soal('Apa arti penting pengumpulan Al-Qur\'an pada masa Abu Bakar?', ['Menjadi awal penggunaan kalender Masehi', 'Menggantikan seluruh hafalan Al-Qur\'an', 'Menandai berakhirnya semua konflik di Arabia', 'Menjadi fondasi bagi standardisasi mushaf pada masa Utsman'], 3, 'Suhuf yang dihimpun pada masa Abu Bakar menjadi fondasi bagi standardisasi salinan mushaf pada masa Utsman.'),
  soal('Siapakah tokoh yang mengaku nabi dan menjadi salah satu lawan dalam Perang Riddah?', ['Suhail bin Amr', 'Musailamah al-Kadzdzab', 'Salman al-Farisi', 'Abdullah bin Zubair'], 1, 'Musailamah al-Kadzdzab disebut sebagai tokoh yang mengaku nabi pada masa Perang Riddah.'),
  soal('Siapakah panglima yang termasuk tokoh penting dalam konflik masa Abu Bakar?', ['Abu Sufyan bin Harb', 'Malik bin Auf', 'Khalid bin Walid', 'Salman al-Farisi'], 2, 'Khalid bin Walid merupakan salah satu tokoh militer penting pada masa Abu Bakar.'),
  soal('Peristiwa pengumpulan Al-Qur\'an pada masa Abu Bakar menghasilkan kumpulan yang dikenal sebagai ...', ['Suhuf', 'Diwan', 'Piagam Madinah', 'Mushaf standar Utsmani'], 0, 'Kumpulan catatan Al-Qur\'an pada masa Abu Bakar dikenal sebagai suhuf.'),
  soal('Kira-kira berapa lama Abu Bakar menjadi khalifah?', ['Sekitar 10 tahun', 'Sekitar 12 tahun', 'Sekitar 5 tahun', 'Sekitar 2 tahun'], 3, 'Masa kepemimpinan Abu Bakar berlangsung sekitar dua tahun, dari 632 sampai 634 M.'),
  soal('Siapa yang kemudian menjadi khalifah kedua setelah Abu Bakar?', ['Utsman bin Affan', 'Umar bin Khattab', 'Ali bin Abi Thalib', 'Hasan bin Ali'], 1, 'Umar bin Khattab menggantikan Abu Bakar sebagai khalifah kedua.'),
  soal('Fokus politik penting Abu Bakar pada awal kekhalifahan adalah ...', ['Mendirikan Dinasti Umayyah', 'Memimpin Perang Jamal', 'Menjaga kesatuan komunitas Muslim', 'Menyelesaikan tahkim di Shiffin'], 2, 'Menjaga persatuan umat menjadi salah satu tantangan utama Abu Bakar setelah Nabi wafat.'),
  soal('Manakah pasangan peristiwa dan tokoh yang tepat?', ['Pengumpulan suhuf — Zaid bin Tsabit', 'Yarmuk — Musailamah al-Kadzdzab', 'Tahkim — Umar bin Khattab', 'Dzat as-Sawari — Abu Bakar'], 0, 'Zaid bin Tsabit ditugaskan menghimpun catatan Al-Qur\'an menjadi suhuf pada masa Abu Bakar.'),
  soal('Mengapa pengumpulan Al-Qur\'an pada masa Abu Bakar berbeda dari standardisasi mushaf pada masa Utsman?', ['Abu Bakar mengumpulkan catatan menjadi suhuf, sedangkan Utsman menstandardisasi salinan mushaf', 'Abu Bakar membuat kalender, sedangkan Utsman memimpin Yarmuk', 'Abu Bakar mengirim mushaf ke Mesir, sedangkan Utsman memimpin Riddah', 'Keduanya adalah peristiwa yang sama persis'], 0, 'Pengumpulan suhuf pada masa Abu Bakar menjadi langkah awal, sedangkan standardisasi salinan dilakukan pada masa Utsman.'),
  soal('Perang Riddah tidak dapat disederhanakan sebagai satu konflik dengan alasan yang seragam karena ...', ['Tidak melibatkan kelompok Arab', 'Seluruhnya terjadi di Mesir', 'Latar belakang kelompok yang terlibat beragam', 'Semua kelompok memiliki tujuan yang identik'], 2, 'Ringkasan menekankan bahwa konflik Riddah mencakup kelompok dengan latar belakang yang beragam.'),
  soal('Warisan utama Abu Bakar yang berkaitan dengan pemerintahan dan Al-Qur\'an adalah ...', ['Membentuk armada laut besar dan memimpin Dzat as-Sawari', 'Menjaga kesatuan umat dan memulai pengumpulan Al-Qur\'an', 'Menetapkan tahkim dengan Muawiyah', 'Mendirikan pemerintahan Dinasti Umayyah'], 1, 'Abu Bakar mempertahankan kesatuan politik umat dan memulai pengumpulan Al-Qur\'an dalam bentuk suhuf.'),
  soal('Tokoh yang tercatat bersama Umar dan Zaid bin Tsabit sebagai tokoh penting masa Abu Bakar adalah ...', ['Musailamah al-Kadzdzab', 'Malik bin Auf', 'Talhah bin Ubaidillah saja', 'Khalid bin Walid'], 3, 'Khalid bin Walid merupakan tokoh penting dalam peristiwa militer pada masa Abu Bakar.'),

  // C. Umar bin Khattab
  soal('Siapakah yang mengangkat Umar sebagai calon penerus sebelum Umar memperoleh baiat?', ['Abu Bakar ash-Shiddiq', 'Utsman bin Affan', 'Ali bin Abi Thalib', 'Muawiyah bin Abi Sufyan'], 0, 'Umar ditunjuk oleh Abu Bakar dan kemudian memperoleh baiat sebagai khalifah.'),
  soal('Pertempuran Yarmuk pada 636 M merupakan pertempuran penting melawan ...', ['Kekaisaran Sasaniyah Persia', 'Hawazin', 'Bizantium', 'Khawarij'], 2, 'Yarmuk menjadi titik balik penting bagi penguasaan wilayah Syam dari Bizantium.'),
  soal('Pertempuran Qadisiyyah berkaitan dengan konflik melawan ...', ['Bizantium di Syam', 'Kekaisaran Sasaniyah Persia', 'Quraisy di Makkah', 'Kelompok Hawazin'], 1, 'Qadisiyyah merupakan pertempuran penting dalam konflik dengan Kekaisaran Sasaniyah Persia.'),
  soal('Pada masa khalifah siapakah Yerusalem masuk ke dalam pemerintahan Muslim sekitar 637–638 M?', ['Abu Bakar', 'Utsman', 'Ali', 'Umar bin Khattab'], 3, 'Yerusalem masuk ke dalam pemerintahan Muslim pada masa Umar bin Khattab.'),
  soal('Siapakah yang memimpin ekspedisi ke Mesir pada 639–642 M?', ['Amr bin al-\'Ash', 'Zaid bin Tsabit', 'Abdullah bin Rawahah', 'Musailamah al-Kadzdzab'], 0, 'Ekspedisi Mesir pada masa Umar dipimpin oleh Amr bin al-\'Ash.'),
  soal('Manakah yang merupakan salah satu kebijakan administrasi pada masa Umar?', ['Memulai Perang Jamal', 'Menetapkan standardisasi salinan mushaf Utsmani', 'Mengembangkan sistem diwan dan pencatatan tunjangan', 'Membentuk kelompok Khawarij'], 2, 'Pada masa Umar, sistem diwan dan pencatatan tunjangan dikembangkan untuk memperkuat administrasi.'),
  soal('Kalender Hijriah ditetapkan dengan titik awal berupa peristiwa ...', ['Perang Badar', 'Hijrah Nabi', 'Penaklukan Mesir', 'Wafatnya Umar'], 1, 'Pada masa Umar, kalender Hijriah ditetapkan dengan tahun Hijrah sebagai titik awal.'),
  soal('Berapa lama kira-kira masa pemerintahan Umar bin Khattab?', ['Sekitar 2 tahun', 'Sekitar 5 tahun', 'Sekitar 12 tahun', 'Sekitar 10 tahun'], 3, 'Umar memimpin sekitar sepuluh tahun, dari 634 sampai 644 M.'),
  soal('Siapakah tokoh yang terkait dengan ekspansi ke Mesir pada masa Umar?', ['Amr bin al-\'Ash', 'Musailamah al-Kadzdzab', 'Talhah bin Ubaidillah', 'Zaid bin Haritsah'], 0, 'Amr bin al-\'Ash memimpin ekspedisi ke Mesir pada 639–642 M.'),
  soal('Selain perluasan wilayah, masa Umar dikenal karena ...', ['Pengepungan rumah khalifah di Madinah', 'Perang Shiffin dan tahkim', 'Penguatan administrasi, peradilan, dan pengelolaan keuangan', 'Pembangunan Dinasti Umayyah'], 2, 'Warisan Umar meliputi penguatan tata pemerintahan, peradilan, administrasi, dan keuangan.'),
  soal('Manakah pasangan pertempuran dan konteks yang tepat?', ['Yamamah — melawan Bizantium', 'Yarmuk — melawan Bizantium', 'Nahrawan — melawan Sasaniyah', 'Jamal — melawan Persia'], 1, 'Yarmuk merupakan pertempuran melawan Bizantium di kawasan Syam.'),
  soal('Qadisiyyah biasanya ditempatkan sekitar tahun ...', ['632 M', '644 M', '656 M', '636–637 M'], 3, 'Ringkasan menempatkan Qadisiyyah sekitar 636–637 M.'),
  soal('Tokoh yang dikenal sebagai panglima penting dan dikaitkan dengan periode perluasan wilayah pada masa Umar adalah ...', ['Khalid bin Walid', 'Musailamah al-Kadzdzab', 'Suhail bin Amr', 'Abdullah bin Ubay'], 0, 'Khalid bin Walid termasuk tokoh penting dalam perluasan wilayah pada masa Umar.'),
  soal('Siapakah yang termasuk tokoh penting lain pada masa Umar selain Khalid bin Walid?', ['Malik bin Auf', 'Zaid bin Tsabit saja', 'Abu Ubaidah bin al-Jarrah', 'Suhail bin Amr'], 2, 'Abu Ubaidah bin al-Jarrah disebut sebagai salah satu tokoh penting pada masa Umar.'),
  soal('Bagaimana Umar wafat menurut ringkasan?', ['Dalam Perang Shiffin', 'Setelah mengalami serangan ketika salat', 'Saat memimpin ekspedisi Mesir', 'Dalam Perang Nahrawan'], 1, 'Umar wafat pada 644 M setelah mengalami serangan ketika salat.'),
  soal('Apa yang dibentuk setelah wafatnya Umar untuk terlibat dalam pemilihan khalifah berikutnya?', ['Armada laut', 'Dewan delegasi kabilah', 'Pasukan Riddah', 'Dewan syura beranggotakan enam tokoh'], 3, 'Setelah Umar wafat, dewan syura yang beranggotakan enam tokoh terlibat dalam pemilihan khalifah berikutnya.'),
  soal('Perluasan pemerintahan Islam ke kawasan manakah yang terjadi pada masa Umar?', ['Syam, Irak, Persia, dan Mesir', 'Andalusia, Prancis, dan Italia', 'India, Tiongkok, dan Jepang', 'Nusantara dan Australia'], 0, 'Masa Umar ditandai perluasan ke Syam, Irak, Persia, dan Mesir.'),
  soal('Tujuan pencatatan tunjangan melalui sistem diwan adalah bagian dari ...', ['Perjanjian dengan Muawiyah', 'Pengelolaan administrasi pemerintahan', 'Standardisasi mushaf Utsmani', 'Pemilihan Abu Bakar di Saqifah'], 1, 'Sistem diwan dan pencatatan tunjangan merupakan bagian dari penguatan administrasi pemerintahan.'),
  soal('Siapakah yang menggantikan Umar sebagai khalifah setelah proses syura?', ['Abu Bakar', 'Ali bin Abi Thalib', 'Utsman bin Affan', 'Hasan bin Ali'], 2, 'Utsman bin Affan dipilih melalui proses syura setelah wafatnya Umar.'),
  soal('Pernyataan manakah yang paling tepat tentang kepemimpinan Umar?', ['Masa pemerintahannya hanya berfokus pada konflik internal', 'Ia memimpin Perang Jamal dan tahkim', 'Ia menjadi khalifah setelah Ali', 'Masa pemerintahannya memadukan ekspansi wilayah dengan penguatan administrasi'], 3, 'Masa Umar dikenal karena perluasan wilayah sekaligus penguatan administrasi negara.'),

  // D. Utsman bin Affan
  soal('Bagaimana Utsman bin Affan dipilih menjadi khalifah?', ['Melalui dewan syura yang dibentuk setelah wafatnya Umar', 'Melalui tahkim dengan Muawiyah', 'Melalui penunjukan Ali setelah Perang Jamal', 'Melalui pewarisan dari Abu Bakar'], 0, 'Utsman dipilih melalui proses syura setelah wafatnya Umar.'),
  soal('Apa pencapaian Utsman yang sangat dikenal terkait Al-Qur\'an?', ['Pertama kali menerima wahyu', 'Menetapkan tahun Hijrah sebagai awal kalender', 'Melakukan standardisasi salinan mushaf Al-Qur\'an', 'Mengusulkan pengumpulan suhuf setelah Yamamah'], 2, 'Utsman menstandardisasi salinan mushaf berdasarkan bahan yang telah dihimpun sebelumnya.'),
  soal('Standardisasi mushaf pada masa Utsman berlangsung sekitar ...', ['632 M', '650-an M', '636 M', '661 M'], 1, 'Ringkasan menempatkan standardisasi mushaf pada sekitar tahun 650-an M.'),
  soal('Siapakah tokoh yang disebut memimpin tim terkait penyalinan mushaf pada masa Utsman dan sebelumnya menghimpun suhuf?', ['Amr bin al-\'Ash', 'Muawiyah bin Abi Sufyan', 'Abu Ubaidah bin al-Jarrah', 'Zaid bin Tsabit'], 3, 'Zaid bin Tsabit berperan dalam penghimpunan suhuf dan disebut terkait tim standardisasi mushaf.'),
  soal('Apa yang dilakukan terhadap salinan mushaf standar pada masa Utsman?', ['Disimpan hanya di rumah khalifah dan tidak disebarkan', 'Dikirim ke sejumlah pusat wilayah Muslim', 'Dikirim hanya ke wilayah Bizantium', 'Dihancurkan setelah penyalinan'], 1, 'Salinan standar mushaf dikirimkan ke sejumlah pusat wilayah Muslim.'),
  soal('Pertempuran Dzat as-Sawari pada 655 M merupakan pertempuran ...', ['Laut antara pasukan Muslim dan Bizantium', 'Darat melawan Musailamah', 'Melawan Khawarij di Nahrawan', 'Melawan kelompok Hawazin'], 0, 'Dzat as-Sawari dikenal sebagai salah satu pertempuran laut penting antara Muslim dan Bizantium.'),
  soal('Salah satu perkembangan militer pada masa Utsman adalah ...', ['Penggalian parit di Madinah', 'Ekspedisi Usamah bin Zaid', 'Pengembangan armada laut', 'Pembentukan dewan syura enam orang setelah wafatnya Umar'], 2, 'Pada masa Utsman, kekuatan maritim atau armada laut semakin berkembang.'),
  soal('Masa pemerintahan Utsman berlangsung sekitar ...', ['2 tahun', '10 tahun', '5 tahun', '12 tahun'], 3, 'Utsman memimpin sekitar dua belas tahun, dari 644 sampai 656 M.'),
  soal('Pada tahun berapa krisis politik berujung pada wafatnya Utsman?', ['632 M', '656 M', '636 M', '661 M'], 1, 'Utsman wafat pada 656 M setelah krisis politik dan pengepungan rumahnya.'),
  soal('Apa salah satu faktor yang memicu ketegangan pada akhir pemerintahan Utsman menurut ringkasan?', ['Penolakan terhadap kalender Hijriah saja', 'Perselisihan mengenai Perang Yamamah', 'Ketidakpuasan terhadap sejumlah pejabat dan kebijakan pemerintahan', 'Konflik antara Ali dan Muawiyah di Shiffin'], 2, 'Ketidakpuasan terhadap sejumlah pejabat dan kebijakan menjadi bagian dari latar belakang krisis politik.'),
  soal('Manakah yang merupakan warisan utama Utsman?', ['Pembentukan sistem diwan', 'Kemenangan di Qadisiyyah', 'Pembentukan kelompok Khawarij', 'Standardisasi salinan mushaf Al-Qur\'an'], 3, 'Standardisasi salinan mushaf Al-Qur\'an merupakan pencapaian utama yang dikenal dari masa Utsman.'),
  soal('Apa perbedaan utama tindakan Abu Bakar dan Utsman terhadap pengumpulan Al-Qur\'an?', ['Abu Bakar memulai penghimpunan suhuf, Utsman menstandardisasi salinan mushaf', 'Abu Bakar menstandardisasi mushaf, Utsman baru menerima wahyu', 'Abu Bakar mengirim salinan ke provinsi, Utsman menghapus catatan', 'Tidak ada perbedaan dan keduanya peristiwa yang sepenuhnya sama'], 0, 'Penghimpunan suhuf dimulai pada masa Abu Bakar, sedangkan standardisasi mushaf dilakukan pada masa Utsman.'),
  soal('Siapakah yang disebut sebagai tokoh penting terkait masa Utsman?', ['Malik bin Auf', 'Zaid bin Tsabit', 'Musailamah al-Kadzdzab', 'Abdullah bin Jubair'], 1, 'Zaid bin Tsabit termasuk tokoh penting terkait penghimpunan dan standardisasi mushaf.'),
  soal('Selain Zaid bin Tsabit, siapa tokoh yang disebut dalam konteks periode Utsman?', ['Abdullah bin Ubay', 'Sa\'ad bin Rabi\'', 'Hudzaifah bin al-Yaman', 'Waraqah bin Nawfal'], 2, 'Hudzaifah bin al-Yaman termasuk tokoh yang dikaitkan dengan periode Utsman dalam ringkasan.'),
  soal('Krisis pada akhir masa Utsman berpengaruh terhadap periode berikutnya karena ...', ['Menandai awal konflik yang berlanjut pada masa Ali', 'Mengakhiri seluruh perselisihan politik', 'Membuka masa kekhalifahan Umar', 'Menyebabkan perang melawan Bizantium di Yarmuk'], 0, 'Konflik politik di akhir masa Utsman menjadi awal krisis besar yang berlanjut pada masa Ali.'),
  soal('Wilayah pemerintahan pada masa Utsman meluas ke beberapa kawasan ...', ['Eropa Utara dan Skandinavia', 'Amerika dan Australia', 'Asia Timur saja', 'Afrika Utara dan kawasan timur'], 3, 'Pada masa Utsman terjadi ekspansi ke beberapa kawasan Afrika Utara dan timur.'),
  soal('Manakah pasangan yang benar?', ['Dzat as-Sawari — pertempuran laut', 'Dzat as-Sawari — pertempuran di Nahrawan', 'Standardisasi mushaf — masa Abu Bakar', 'Pengembangan diwan — masa Ali saja'], 0, 'Dzat as-Sawari adalah pertempuran laut penting pada masa Utsman.'),
  soal('Bagaimana rincian sebab konflik pada akhir masa Utsman sebaiknya dipahami?', ['Semua sumber sepakat sepenuhnya', 'Rincian penjelasannya beragam dalam sumber sejarah', 'Tidak ada ketegangan sama sekali', 'Hanya disebabkan oleh ekspansi ke Mesir'], 1, 'Ringkasan menyatakan bahwa rincian sebab konflik memiliki beragam penjelasan dalam sumber sejarah.'),
  soal('Siapakah khalifah yang menggantikan Utsman setelah ia wafat?', ['Umar bin Khattab', 'Abu Bakar ash-Shiddiq', 'Ali bin Abi Thalib', 'Muawiyah bin Abi Sufyan secara langsung sebagai khalifah'], 2, 'Ali bin Abi Thalib dibaiat setelah Utsman terbunuh.'),
  soal('Pernyataan paling tepat mengenai pemerintahan Utsman adalah ...', ['Hanya diisi perang saudara tanpa ekspansi', 'Tidak ada perubahan dalam administrasi Al-Qur\'an', 'Berakhir pada 644 M', 'Menggabungkan standardisasi mushaf dan ekspansi dengan tantangan politik internal'], 3, 'Masa Utsman ditandai standardisasi mushaf, ekspansi, perkembangan armada laut, dan konflik politik pada akhir pemerintahannya.'),

  // E. Ali bin Abi Thalib
  soal('Dalam keadaan bagaimana Ali bin Abi Thalib dibaiat sebagai khalifah?', ['Dalam situasi krisis setelah wafatnya Utsman', 'Setelah Umar menunjuknya tanpa baiat', 'Setelah Perang Yarmuk', 'Setelah mendirikan Dinasti Umayyah'], 0, 'Ali dibaiat setelah terbunuhnya Utsman, ketika keadaan politik sedang mengalami krisis.'),
  soal('Perang Jamal pada 656 M berlangsung di sekitar ...', ['Yerusalem', 'Mesir', 'Basrah', 'Qadisiyyah'], 2, 'Perang Jamal berlangsung di Basrah dan melibatkan pihak Ali serta kelompok yang di dalamnya terdapat Aisyah, Talhah, dan Zubair.'),
  soal('Tokoh manakah yang berada dalam kelompok yang berhadapan dengan pihak Ali dalam Perang Jamal menurut ringkasan?', ['Zaid bin Tsabit', 'Aisyah, Talhah, dan Zubair', 'Musailamah dan Khalid bin Walid', 'Abu Bakar dan Umar'], 1, 'Ringkasan menyebut Aisyah, Talhah, dan Zubair dalam kelompok yang terlibat dalam Perang Jamal.'),
  soal('Salah satu persoalan utama di balik Perang Jamal adalah perbedaan pandangan tentang ...', ['Penetapan kalender Hijriah', 'Perluasan ke Mesir', 'Standardisasi mushaf', 'Penanganan pembunuh Utsman dan pemulihan ketertiban'], 3, 'Persoalan penanganan pembunuh Utsman dan pemulihan ketertiban merupakan salah satu latar konflik.'),
  soal('Perang Shiffin terjadi pada ...', ['657 M', '632 M', '644 M', '661 M'], 0, 'Perang Shiffin terjadi pada 657 M antara pihak Ali dan pasukan Muawiyah.'),
  soal('Siapakah pemimpin pihak yang berhadapan dengan Ali dalam Perang Shiffin?', ['Abu Ubaidah bin al-Jarrah', 'Amr bin al-\'Ash sebagai khalifah', 'Muawiyah bin Abi Sufyan', 'Musailamah al-Kadzdzab'], 2, 'Ali berhadapan dengan pasukan Muawiyah, yang saat itu menjadi gubernur Syam.'),
  soal('Apa yang dimaksud dengan tahkim dalam konflik setelah Perang Shiffin?', ['Pengumpulan suhuf Al-Qur\'an', 'Proses arbitrase atau penengahan', 'Perluasan wilayah ke Mesir', 'Pemilihan khalifah di Saqifah'], 1, 'Tahkim berarti proses arbitrase atau penengahan yang terjadi setelah Perang Shiffin.'),
  soal('Kelompok yang muncul di antara pihak yang menolak tahkim dikenal sebagai ...', ['Anshar', 'Muhajirin', 'Syura', 'Khawarij'], 3, 'Sebagian pendukung Ali menolak tahkim dan kemudian dikenal sebagai kelompok Khawarij.'),
  soal('Perang Nahrawan sekitar 658 M melibatkan Ali dan ...', ['Kelompok Khawarij', 'Pasukan Bizantium di Yarmuk', 'Quraisy di Badar', 'Hawazin di Hunain'], 0, 'Ali menghadapi kelompok Khawarij dalam Perang Nahrawan sekitar 658 M.'),
  soal('Di kota manakah Ali bin Abi Thalib wafat pada 661 M?', ['Madinah', 'Basrah', 'Kufah', 'Yerusalem'], 2, 'Ali wafat di Kufah pada 661 M.'),
  soal('Berapa lama kira-kira masa pemerintahan Ali?', ['Sekitar 12 tahun', 'Sekitar 5 tahun', 'Sekitar 10 tahun', 'Sekitar 2 tahun'], 1, 'Ali memimpin sekitar lima tahun, dari 656 sampai 661 M.'),
  soal('Siapakah yang mencapai kesepakatan damai dengan Muawiyah setelah Ali wafat?', ['Zaid bin Tsabit', 'Amr bin al-\'Ash', 'Talhah bin Ubaidillah', 'Hasan bin Ali'], 3, 'Setelah Ali wafat, Hasan bin Ali mencapai kesepakatan damai dengan Muawiyah.'),
  soal('Istilah al-fitnah al-kubra dalam ringkasan berkaitan dengan ...', ['Pembentukan armada laut', 'Krisis dan konflik besar internal umat Islam', 'Awal kalender Hijriah', 'Ekspedisi ke Mesir'], 1, 'Masa Ali penting untuk memahami fitnah besar atau konflik politik internal umat Islam.'),
  soal('Manakah pasangan peristiwa dan tahun yang tepat?', ['Jamal — 656 M', 'Yarmuk — 657 M', 'Nahrawan — 632 M', 'Shiffin — 644 M'], 0, 'Perang Jamal terjadi pada 656 M, pada awal masa kekhalifahan Ali.'),
  soal('Siapakah yang menjadi gubernur Syam ketika berhadapan dengan Ali pada Perang Shiffin?', ['Khalid bin Walid', 'Sa\'ad bin Abi Waqqas', 'Muawiyah bin Abi Sufyan', 'Zaid bin Tsabit'], 2, 'Muawiyah adalah gubernur Syam saat konflik dengan Ali dalam Perang Shiffin.'),
  soal('Mengapa masa pemerintahan Ali dinilai penuh tantangan?', ['Karena sama sekali tidak ada konflik', 'Karena pemerintahan berfokus hanya pada armada laut', 'Karena seluruh wilayah telah lepas dari Bizantium', 'Karena ia menghadapi konflik internal dan tuntutan penyelesaian pembunuhan Utsman'], 3, 'Ali memimpin dalam situasi krisis, termasuk perbedaan tentang penanganan pembunuhan Utsman dan konflik internal.'),
  soal('Perang Jamal, Shiffin, dan Nahrawan memiliki kesamaan karena semuanya terjadi pada masa ...', ['Ali bin Abi Thalib', 'Abu Bakar ash-Shiddiq', 'Umar bin Khattab', 'Utsman bin Affan'], 0, 'Ketiga konflik tersebut merupakan peristiwa penting pada masa Ali bin Abi Thalib.'),
  soal('Apa dampak tahkim terhadap sebagian pendukung Ali?', ['Mereka semua berpindah ke Bizantium', 'Tahkim langsung mengakhiri semua perselisihan', 'Sebagian menolak hasil atau prosesnya dan terpisah menjadi Khawarij', 'Mereka mengangkat Utsman kembali'], 2, 'Sebagian pendukung Ali menolak arbitrase dan kemudian dikenal sebagai Khawarij.'),
  soal('Apa salah satu pelajaran sejarah dari masa Ali menurut ringkasan?', ['Administrasi tidak pernah penting', 'Perluasan wilayah selalu menyelesaikan konflik', 'Setiap perbedaan pasti berakhir damai dengan segera', 'Menjaga persatuan menjadi sangat sulit ketika konflik politik internal terjadi'], 3, 'Masa Ali menunjukkan besarnya tantangan menjaga persatuan ketika terjadi konflik politik internal.'),
  soal('Pernyataan yang benar tentang Perang Shiffin adalah ...', ['Konflik antara Ali dan pasukan Muawiyah yang dilanjutkan dengan tahkim', 'Konflik Abu Bakar melawan Musailamah', 'Pertempuran laut melawan Bizantium', 'Pertempuran melawan Hawazin setelah Fathu Makkah'], 0, 'Perang Shiffin terjadi antara Ali dan Muawiyah, kemudian berlanjut pada proses tahkim.'),
  // 
  // F. Cara Pengangkatan, Perbandingan, dan Transisi
  soal('Cara pengangkatan Abu Bakar yang paling tepat menurut ringkasan adalah ...', ['Ditunjuk oleh Umar dan kemudian tidak memerlukan baiat', 'Dipilih oleh dewan syura enam orang', 'Musyawarah di Saqifah, kemudian baiat', 'Melalui tahkim setelah Shiffin'], 2, 'Abu Bakar diangkat melalui musyawarah di Saqifah, kemudian memperoleh baiat.'),
  soal('Cara pengangkatan Umar berbeda dari Abu Bakar karena Umar ...', ['Dipilih melalui pertempuran Jamal', 'Ditunjuk oleh Abu Bakar, kemudian memperoleh baiat', 'Dipilih setelah Perang Shiffin', 'Mewarisi jabatan dari Ali'], 1, 'Umar ditunjuk oleh Abu Bakar dan kemudian mendapat baiat.'),
  soal('Siapakah yang dipilih melalui dewan syura yang dibentuk setelah wafatnya Umar?', ['Abu Bakar', 'Ali', 'Hasan', 'Utsman bin Affan'], 3, 'Utsman dipilih melalui dewan syura setelah wafatnya Umar.'),
  soal('Ali bin Abi Thalib menjadi khalifah melalui ...', ['Baiat dalam situasi krisis setelah wafatnya Utsman', 'Penunjukan oleh Abu Bakar', 'Pemilihan dewan syura setelah wafatnya Umar', 'Tahkim dengan Bizantium'], 0, 'Ali dibaiat setelah Utsman terbunuh, dalam situasi krisis politik.'),
  soal('Apa hal penting yang perlu dipahami dari empat cara pengangkatan khalifah?', ['Keempatnya berlangsung dengan cara yang persis sama', 'Semua khalifah dipilih melalui perang', 'Proses pengangkatan mereka tidak sama persis', 'Semua khalifah merupakan keturunan langsung khalifah sebelumnya'], 2, 'Cara pengangkatan keempat khalifah berbeda-beda dan penting untuk memahami perkembangan politik awal Islam.'),
  soal('Manakah pasangan khalifah dan kebijakan yang tepat?', ['Umar — standardisasi mushaf sekitar 650-an', 'Abu Bakar — memulai pengumpulan Al-Qur\'an menjadi suhuf', 'Ali — Pertempuran Yarmuk', 'Utsman — Perang Riddah'], 1, 'Abu Bakar memulai penghimpunan Al-Qur\'an dalam bentuk suhuf setelah usul Umar.'),
  soal('Manakah pasangan khalifah dan peristiwa yang tepat?', ['Ali — Perang Jamal', 'Abu Bakar — Perang Shiffin', 'Umar — Perang Nahrawan', 'Utsman — Perang Yamamah sebagai khalifah'], 0, 'Perang Jamal merupakan salah satu konflik penting pada masa Ali bin Abi Thalib.'),
  soal('Pertempuran manakah yang menjadi titik balik penting penguasaan wilayah Syam dari Bizantium pada masa Umar?', ['Yamamah', 'Nahrawan', 'Dzat as-Sawari', 'Yarmuk'], 3, 'Yarmuk pada 636 M menjadi salah satu titik balik penting dalam penguasaan wilayah Syam.'),
  soal('Peristiwa manakah yang berkaitan dengan pengembangan kekuatan laut pada masa Utsman?', ['Perang Riddah', 'Dewan syura setelah Umar wafat', 'Pertempuran Dzat as-Sawari', 'Perang Jamal'], 2, 'Dzat as-Sawari merupakan pertempuran laut pada masa Utsman.'),
  soal('Apa yang menandai peralihan dari periode Khulafaur Rasyidin menuju Dinasti Umayyah dalam periodisasi umum?', ['Pengangkatan Abu Bakar di Saqifah', 'Kesepakatan damai Hasan bin Ali dengan Muawiyah', 'Pertempuran Yarmuk', 'Penetapan kalender Hijriah'], 1, 'Kesepakatan Hasan bin Ali dengan Muawiyah menandai peralihan pemerintahan dalam periodisasi sejarah yang umum.'),
  ],
  fiqh: [
    soal('Berapa rakaat salat fardu Subuh?', ['2', '3', '4', '1'], 0, 'Salat Subuh dua rakaat.'),
    soal('Berapa kali salat fardu dikerjakan dalam sehari semalam?', ['3', '4', '5', '6'], 2, 'Subuh, Zuhur, Asar, Magrib, dan Isya.'),
    soal('Salat fardu yang berjumlah tiga rakaat adalah?', ['Subuh', 'Zuhur', 'Asar', 'Magrib'], 3, 'Salat Magrib tiga rakaat.'),
    soal('Berwudu dilakukan untuk menghilangkan?', ['Hadas kecil', 'Najis berat', 'Rasa lapar', 'Hadas besar'], 0, 'Wudu mengangkat hadas kecil agar sah melaksanakan salat.'),
    soal('Rukun Islam yang pertama adalah?', ['Salat', 'Syahadat', 'Zakat', 'Puasa'], 1, 'Rukun Islam pertama adalah syahadat.'),
    soal('Puasa wajib dilaksanakan pada bulan?', ['Syaban', 'Ramadan', 'Syawal', 'Rajab'], 1, 'Puasa wajib dilakukan pada bulan Ramadan.'),
    soal('Zakat yang dikeluarkan menjelang Idulfitri disebut?', ['Zakat mal', 'Zakat fitrah', 'Zakat profesi', 'Infak'], 1, 'Zakat fitrah wajib dikeluarkan sebelum salat Id.'),
    soal('Umat Islam menghadap ke arah mana ketika salat?', ["Ka'bah di Makkah", 'Masjid Nabawi', 'Baitul Maqdis', 'Gua Hira'], 0, "Arah kiblat adalah Ka'bah."),
    soal('Salat Jumat dilaksanakan pada waktu?', ['Subuh', 'Zuhur', 'Asar', 'Isya'], 1, 'Salat Jumat menggantikan salat Zuhur bagi laki-laki yang wajib.'),
    soal('Ucapan yang mengakhiri salat adalah?', ['Takbir', 'Salam', 'Doa iftitah', 'Fatihah'], 1, 'Salat ditutup dengan salam.'),
    soal('Berapa rakaat salat fardu Isya?', ['2', '3', '4', '5'], 2, 'Salat Isya empat rakaat.'),
    soal('Puasa dilakukan dari terbit fajar sampai?', ['Zuhur', 'Terbenam matahari', 'Tengah malam', 'Asar'], 1, 'Berbuka puasa saat matahari terbenam (waktu Magrib).'),
    soal("Apa yang dimaksud dengan thaharah dalam fikih?", ["Bersuci dari hadas dan najis", "Mengumpulkan harta", "Melakukan perjalanan", "Membaca sejarah"], 0, "Thaharah berarti bersuci dari hadas dan najis sesuai ketentuan syariat."),
    soal("Apa perbedaan utama antara hadas dan najis?", ["Najis hanya terdapat pada pakaian", "Hadas adalah keadaan yang menghalangi ibadah tertentu, sedangkan najis adalah benda kotor menurut hukum syariat", "Hadas selalu terlihat, najis selalu tidak terlihat", "Keduanya selalu berarti hal yang sama"], 1, "Hadas merupakan keadaan hukum; najis adalah benda yang perlu disucikan menurut ketentuan fikih."),
    soal("Hadas kecil pada umumnya dihilangkan dengan cara ...", ["Berpuasa", "Mengumandangkan azan", "Berwudhu", "Membayar zakat"], 2, "Wudhu digunakan untuk mengangkat hadas kecil ketika syaratnya terpenuhi."),
    soal("Hadas besar pada umumnya dihilangkan dengan ...", ["Membasuh tangan saja", "Mengganti pakaian saja", "Bersedekah", "Mandi wajib"], 3, "Mandi wajib dilakukan untuk mengangkat hadas besar seperti janabah."),
    soal("Manakah contoh air yang pada dasarnya suci dan menyucikan?", ["Air hujan yang tidak berubah sifatnya karena najis", "Air yang berubah bau karena najis", "Minuman bersoda", "Air bercampur zat najis hingga berubah sifat"], 0, "Air hujan termasuk air mutlak selama tidak terkena hal yang mengubahnya menjadi tidak suci."),
    soal("Dalam banyak kitab fikih Syafi’i, air sedikit yang telah digunakan untuk mengangkat hadas disebut ...", ["Air yang berubah menjadi darah", "Air musta’mal; suci tetapi tidak menyucikan menurut pembahasan tersebut", "Air najis dalam semua keadaan", "Air yang selalu haram digunakan"], 1, "Dalam pembahasan fikih Syafi’i, air musta’mal memiliki hukum suci tetapi tidak menyucikan; rincian air dibahas berbeda dalam mazhab lain."),
    soal("Manakah yang termasuk najis menurut pembahasan fikih dasar?", ["Buah segar", "Pakaian yang bersih", "Air kencing manusia", "Air hujan murni"], 2, "Air kencing manusia termasuk najis dan perlu dibersihkan jika mengenai badan atau pakaian."),
    soal("Darah yang keluar dari tubuh pada umumnya diperlakukan dalam fikih dasar sebagai ...", ["Benda yang selalu menyucikan", "Sesuatu yang membatalkan iman secara otomatis", "Najis, dengan rincian dan pengecualian yang dibahas ulama", "Air mutlak"], 2, "Darah pada umumnya dihukumi najis dalam fikih dasar, dengan beberapa rincian menurut jenis dan keadaan."),
    soal("Dalam klasifikasi fikih Syafi’i, contoh najis mukhaffafah adalah ...", ["Darah haid", "Air kencing orang dewasa", "Bangkai babi", "Air kencing bayi laki-laki yang belum berusia dua tahun dan hanya mengonsumsi ASI"], 3, "Najis mukhaffafah memiliki ketentuan khusus untuk bayi laki-laki yang memenuhi syarat tersebut."),
    soal("Dalam klasifikasi fikih Syafi’i, contoh najis mughallazah adalah ...", ["Najis anjing dan babi", "Debu tanah yang suci", "Air hujan", "Buah yang jatuh"], 0, "Najis anjing dan babi digolongkan sebagai najis berat dalam fikih Syafi’i."),
    soal("Menurut ketentuan fikih Syafi’i yang umum diajarkan, wadah yang dijilat anjing disucikan dengan ...", ["Diberi parfum", "Tujuh kali basuhan, salah satunya menggunakan tanah yang suci", "Sekali dilap dengan kain kering", "Dijemur saja tanpa dibasuh"], 1, "Dalam mazhab Syafi’i, wadah yang terkena jilatan anjing dibasuh tujuh kali, salah satunya dengan tanah."),
    soal("Apa tujuan istinja?", ["Menghilangkan kewajiban zakat", "Membatalkan puasa", "Membersihkan najis yang keluar dari qubul atau dubur", "Mengganti kewajiban salat"], 2, "Istinja adalah membersihkan tempat keluarnya kotoran setelah buang air."),
    soal("Istijmar adalah bersuci setelah buang hajat menggunakan ...", ["Minyak wangi saja", "Kain yang terkena najis", "Makanan", "Benda padat yang suci dan dapat membersihkan, sesuai syaratnya"], 3, "Istijmar dilakukan dengan benda yang memenuhi syarat sebagai alat pembersih; terdapat ketentuan jumlah dan cara."),
    soal("Dalam fikih dasar, berapa jumlah minimal usapan istijmar yang lazim diajarkan jika menggunakan batu atau penggantinya dan ingin mencukupkan?", ["Tiga usapan yang membersihkan", "Satu usapan selalu cukup", "Dua puluh usapan", "Tidak ada ketentuan apa pun"], 0, "Pengajaran fikih umum menyebut minimal tiga usapan yang membersihkan; jika belum bersih, ditambah."),
    soal("Salah satu sebab diwajibkannya mandi adalah ...", ["Keluar mani dengan sebab yang mewajibkan mandi", "Tidur sebentar tanpa sebab lain", "Memotong kuku", "Menyentuh buku"], 0, "Keluarnya mani dalam keadaan yang ditetapkan fikih merupakan salah satu sebab mandi wajib."),
    soal("Setelah haid selesai, seorang perempuan hendak kembali salat. Ia perlu ...", ["Membayar fidyah salat", "Mandi wajib setelah darah haid benar-benar berhenti", "Mengganti semua salat selama haid", "Berwudhu tanpa mandi dalam semua keadaan"], 1, "Setelah haid berakhir, mandi wajib menjadi syarat untuk kembali melaksanakan salat."),
    soal("Apa yang dimaksud dengan nifas?", ["Air yang digunakan berwudhu", "Keringat saat berolahraga", "Darah yang keluar setelah persalinan", "Darah yang selalu keluar setiap hari sepanjang hidup"], 2, "Nifas adalah darah yang keluar setelah persalinan menurut pembahasan fikih."),
    soal("Istihadhah secara umum adalah ...", ["Nama lain air wudhu", "Puasa sunah", "Jenis zakat", "Darah di luar haid atau nifas yang memiliki hukum tersendiri"], 3, "Istihadhah merupakan darah di luar haid atau nifas; tata cara bersuci dan salatnya memiliki rincian khusus."),
    soal("Perempuan yang sedang haid menurut hukum fikih tidak melaksanakan salat dan ...", ["Mengqadha puasa Ramadan yang ditinggalkan, tetapi tidak mengqadha salat haid", "Wajib mengqadha semua salat haid", "Tidak perlu mengqadha puasa yang ditinggalkan", "Harus membayar zakat setiap kali haid"], 0, "Dalam hukum fikih yang masyhur, salat saat haid tidak diqadha, sedangkan puasa Ramadan yang ditinggalkan diqadha."),
    soal("Jika najis mengenai pakaian yang akan digunakan untuk salat, yang perlu dilakukan adalah ...", ["Membiarkannya karena niat sudah cukup", "Membersihkan bagian yang terkena najis sesuai ketentuan", "Menyemprot parfum saja", "Menutupnya dengan pakaian lain tanpa membersihkan dalam semua keadaan"], 1, "Pakaian untuk salat harus suci dari najis yang wajib dihilangkan."),
    soal("Seseorang ragu apakah pakaiannya terkena najis, tetapi tidak memiliki bukti atau tanda yang meyakinkan. Kaidah umum yang diajarkan adalah ...", ["Ia harus mencuci pakaian tujuh kali", "Ia tidak boleh salat seumur hidup", "Hukum asal kesucian tetap berlaku sampai ada kepastian yang mengubahnya", "Pakaian pasti najis setiap kali muncul keraguan"], 2, "Kaidah fikih menyatakan keyakinan tidak dihilangkan oleh keraguan semata."),
    soal("Saat membersihkan najis yang tampak, prinsip umumnya adalah ...", ["Menaburkan debu tanpa aturan pada semua jenis najis", "Membaca doa tanpa melakukan pembersihan", "Menghilangkan benda najis dan membersihkannya dengan cara yang ditentukan", "Menyembunyikan warna najis dengan pewarna"], 2, "Najis yang tampak dibersihkan dengan menghilangkan zatnya dan mengikuti tata cara sesuai jenis najis."),
    soal("Air yang berubah warna, bau, atau rasanya karena tercampur najis dapat dihukumi ...", ["Selalu lebih suci daripada air hujan", "Sebagai air mutlak tanpa syarat", "Sebagai air yang wajib diminum", "Tidak suci dan tidak menyucikan"], 3, "Perubahan sifat air karena najis memengaruhi hukum kesuciannya menurut ketentuan fikih."),
    soal("Apakah mencuci tangan dengan sabun saja otomatis menggantikan wudhu?", ["Tidak; wudhu memiliki tata cara dan rukun tersendiri", "Ya, dalam semua keadaan", "Ya, jika sabunnya wangi", "Tidak, karena tangan tidak boleh dicuci"], 0, "Kebersihan tangan tidak otomatis memenuhi seluruh rukun wudhu."),
    soal("Mengapa bersuci penting sebelum salat?", ["Karena bersuci menghapus semua kewajiban agama", "Karena kesucian dari hadas dan najis termasuk syarat salat", "Karena bersuci menggantikan semua rakaat", "Karena bersuci wajib hanya saat hari raya"], 1, "Kesucian dari hadas dan najis merupakan bagian dari syarat sah salat dalam fikih dasar."),
    soal("Tayamum dapat menjadi pengganti wudhu atau mandi wajib ketika ...", ["Air terasa kurang dingin", "Seseorang ingin menghemat waktu tanpa alasan", "Tidak ada air yang dapat digunakan atau penggunaan air menimbulkan bahaya yang dibenarkan syariat", "Seseorang sekadar tidak ingin memakai air"], 2, "Tayamum memiliki sebab dan syarat, seperti ketiadaan air atau uzur penggunaan air yang diakui syariat."),
    soal("Mana tindakan yang paling tepat ketika ada najis pada lantai?", ["Menutupnya dengan karpet tanpa membersihkannya", "Menyiram parfum saja", "Menganggap semua lantai selalu suci tanpa melihat keadaan", "Membersihkan najis dengan cara yang sesuai hingga hilang"], 3, "Najis yang diketahui harus dibersihkan menurut ketentuan fikih."),
    soal("Manakah pernyataan paling tepat tentang kesucian dan kebersihan?", ["Kebersihan fisik penting, dan kesucian ibadah juga mengikuti ketentuan fikih", "Keduanya selalu identik tanpa aturan khusus", "Kesucian tidak pernah berkaitan dengan ibadah", "Parfum dapat menggantikan semua tata cara bersuci"], 0, "Kebersihan umum penting, tetapi bersuci untuk ibadah mempunyai ketentuan hukum yang khusus."),

    // Wudhu
    soal("Apa tujuan utama wudhu dalam ibadah?", ["Mengangkat hadas kecil untuk ibadah yang mensyaratkannya", "Menggantikan puasa", "Menggantikan mandi wajib dalam semua keadaan", "Menghapus kewajiban salat"], 0, "Wudhu digunakan untuk mengangkat hadas kecil sesuai ketentuan fikih."),
    soal("Dalam mazhab Syafi’i, berapa jumlah rukun wudhu yang umum diajarkan?", ["Sepuluh", "Enam", "Tiga", "Empat"], 1, "Rukun wudhu yang umum diajarkan dalam mazhab Syafi’i ada enam."),
    soal("Manakah yang termasuk rukun wudhu menurut mazhab Syafi’i?", ["Mendahulukan kaki kanan sebagai syarat sah", "Mengulang basuhan tiga kali", "Niat", "Membaca doa setelah wudhu"], 2, "Niat termasuk salah satu rukun wudhu menurut mazhab Syafi’i."),
    soal("Kapan niat wudhu menurut mazhab Syafi’i dilakukan?", ["Setelah semua anggota selesai dibasuh", "Saat keluar dari kamar mandi", "Sehari sebelum wudhu", "Bersamaan dengan awal membasuh wajah"], 3, "Dalam mazhab Syafi’i, niat dilakukan bersamaan dengan awal membasuh wajah."),
    soal("Batas wajah yang wajib dibasuh saat wudhu secara umum adalah ...", ["Dari tempat tumbuh rambut kepala yang lazim hingga dagu, dan dari telinga ke telinga", "Hanya dahi", "Hanya pipi kanan", "Dari leher sampai dada"], 0, "Seluruh batas wajah wajib terkena air saat membasuh wajah."),
    soal("Saat membasuh tangan dalam wudhu, batas wajibnya sampai ...", ["Ujung jari saja", "Siku, termasuk siku", "Pergelangan tangan saja", "Bahu"], 1, "Kedua tangan dibasuh hingga siku, termasuk siku."),
    soal("Bagian kepala yang wajib diusap menurut mazhab Syafi’i adalah ...", ["Kedua telinga saja", "Leher saja", "Sebagian kepala", "Seluruh badan"], 2, "Dalam mazhab Syafi’i, mengusap sebagian kepala sudah memenuhi rukun, dengan rincian yang dikenal dalam kitab fikih."),
    soal("Saat membasuh kaki ketika wudhu, batasnya sampai ...", ["Ujung jari saja", "Betis bagian atas", "Mata kaki, termasuk mata kaki", "Lutut"], 2, "Kedua kaki dibasuh hingga mata kaki, termasuk mata kaki."),
    soal("Manakah urutan rukun wudhu yang benar menurut mazhab Syafi’i?", ["Kaki, kepala, tangan, wajah, niat", "Wajah, kaki, niat, kepala, tangan", "Niat, kaki, wajah, tangan, kepala tanpa urutan", "Niat, wajah, tangan sampai siku, mengusap kepala, kaki sampai mata kaki, tertib"], 3, "Rukun wudhu mazhab Syafi’i dilakukan secara tertib sesuai urutan yang dikenal."),
    soal("Membasuh anggota wudhu tiga kali pada umumnya termasuk ...", ["Sunah wudhu", "Syarat wajib wudhu yang tidak boleh kurang", "Pembatal wudhu", "Pengganti niat"], 0, "Mengulang basuhan tiga kali merupakan sunah; basuhan sekali yang merata dapat memenuhi rukun."),
    soal("Membaca basmalah sebelum wudhu dalam pelajaran fikih dasar biasanya dihukumi ...", ["Perbuatan terlarang dalam semua keadaan", "Sunah", "Rukun yang menggantikan basuhan wajah", "Pembatal wudhu"], 1, "Membaca basmalah diajarkan sebagai sunah wudhu, bukan pengganti rukun."),
    soal("Jika seseorang belum membasuh seluruh bagian wajah yang wajib, wudhunya ...", ["Berubah menjadi tayamum", "Sah hanya jika membaca doa panjang", "Belum memenuhi rukun membasuh wajah", "Tetap sempurna karena niat saja cukup"], 2, "Air harus mengenai seluruh batas wajah yang wajib dibasuh."),
    soal("Apa yang terjadi jika seseorang memakai cat kuku yang membentuk lapisan kedap air sebelum wudhu?", ["Wudhu selalu sah tanpa air mengenai kuku", "Cukup mengusap bagian luar cat", "Cat kuku menggantikan air", "Lapisan itu harus dihilangkan agar air mencapai kuku"], 3, "Penghalang yang mencegah air mencapai anggota wajib dibersihkan sebelum wudhu."),
    soal("Manakah yang membatalkan wudhu menurut mazhab Syafi’i?", ["Keluar sesuatu dari qubul atau dubur", "Memotong rambut", "Memotong kuku", "Membaca Al-Qur’an"], 0, "Keluarnya sesuatu dari qubul atau dubur termasuk pembatal wudhu."),
    soal("Tidur yang menghilangkan kesadaran terhadap keadaan tubuh pada umumnya ...", ["Membatalkan wudhu, dengan rincian pengecualian dalam fikih", "Tidak pernah berpengaruh pada wudhu", "Menggantikan wudhu", "Membatalkan zakat saja"], 0, "Tidur yang menghilangkan kesadaran umumnya membatalkan wudhu; ulama membahas beberapa pengecualian."),
    soal("Dalam mazhab Syafi’i, menyentuh kulit langsung antara laki-laki dan perempuan yang bukan mahram dan dapat menikah satu sama lain umumnya ...", ["Membatalkan puasa secara otomatis", "Membatalkan wudhu, dengan rincian yang dibahas dalam fikih", "Selalu tidak berpengaruh pada wudhu", "Menggantikan mandi wajib"], 1, "Ini merupakan salah satu pembatal wudhu menurut mazhab Syafi’i; mazhab lain memiliki rincian berbeda."),
    soal("Dalam mazhab Syafi’i, menyentuh kemaluan manusia dengan bagian dalam telapak tangan tanpa penghalang umumnya ...", ["Menggantikan mandi wajib", "Membatalkan salat yang sudah selesai", "Membatalkan wudhu", "Tidak pernah berpengaruh"], 2, "Menyentuh kemaluan dengan bagian dalam telapak tangan tanpa penghalang termasuk pembatal wudhu menurut mazhab Syafi’i."),
    soal("Jika seseorang yakin telah berwudhu lalu ragu apakah wudhunya batal, kaidah umum yang digunakan adalah ...", ["Langsung dianggap batal karena ragu", "Wajib mandi besar", "Tidak boleh salat lagi", "Tetap dianggap memiliki wudhu sampai ada kepastian bahwa ia batal"], 3, "Keyakinan tidak hilang hanya karena keraguan."),
    soal("Apakah bercakap-cakap di luar salat membatalkan wudhu dengan sendirinya?", ["Tidak, percakapan biasa bukan pembatal wudhu dengan sendirinya", "Ya, setiap kata membatalkan wudhu", "Hanya kata berbahasa Arab membatalkan wudhu", "Hanya percakapan pelan membatalkan wudhu"], 0, "Percakapan biasa di luar salat tidak termasuk pembatal wudhu yang umum disebut."),
    soal("Apa yang harus dilakukan jika air tidak mencapai bagian kulit yang wajib dibasuh karena tertutup kotoran tebal?", ["Cukup mengusap pakaian", "Menghilangkan penghalang lalu membasuh bagian tersebut", "Membiarkannya karena air tidak penting", "Mengganti basuhan dengan parfum"], 1, "Air perlu mencapai anggota wudhu yang wajib dibasuh."),
    soal("Mendahulukan anggota kanan pada tangan dan kaki termasuk ...", ["Pembatal wudhu", "Syarat untuk mengganti niat", "Sunah wudhu", "Satu-satunya rukun wudhu"], 2, "Mendahulukan anggota kanan merupakan sunah yang dianjurkan."),
    soal("Menghemat air ketika berwudhu berarti ...", ["Selalu hanya memakai satu tetes air", "Tidak perlu memastikan air mengenai anggota wudhu", "Menggunakan air secukupnya tanpa mengurangi rukun", "Tidak membasuh anggota wajib"], 2, "Berhemat air dianjurkan, selama seluruh rukun dan syarat wudhu tetap terpenuhi."),
    soal("Doa setelah wudhu berkedudukan sebagai ...", ["Pengganti niat", "Pengganti semua basuhan", "Pembatal wudhu", "Amalan sunah, bukan rukun yang menggantikan basuhan"], 3, "Doa setelah wudhu termasuk amalan sunah dan tidak menggantikan rukun wudhu."),
    soal("Jika seseorang membasuh wajah, tangan, mengusap kepala, dan membasuh kaki tetapi meninggalkan niat menurut mazhab Syafi’i, maka ...", ["Wudhunya tidak memenuhi rukun niat", "Wudhunya pasti sah karena air sudah digunakan", "Ia otomatis sudah mandi wajib", "Ia tidak perlu salat selamanya"], 0, "Niat merupakan rukun wudhu menurut mazhab Syafi’i."),
    soal("Manakah praktik wudhu yang paling tepat?", ["Mengabaikan bagian yang tertutup penghalang", "Memastikan air mengenai seluruh bagian wajib dan mengikuti urutan rukun", "Membasuh satu tangan saja", "Mengusap sepatu tanpa ketentuan apa pun"], 1, "Wudhu harus memenuhi seluruh rukun dan syaratnya."),

    // Tayamum
    soal("Apa yang dimaksud dengan tayamum?", ["Mengganti salat dengan doa", "Membersihkan pakaian dengan parfum", "Bersuci menggunakan debu atau permukaan bumi yang suci sesuai ketentuan syariat sebagai pengganti wudhu atau mandi", "Mandi menggunakan sabun"], 2, "Tayamum adalah cara bersuci pengganti ketika ada uzur yang dibenarkan syariat."),
    soal("Manakah sebab yang dapat membolehkan tayamum?", ["Tidak suka air dingin meski dapat dihangatkan dengan mudah", "Ingin menghemat beberapa detik tanpa uzur", "Sedang tidak membawa parfum", "Tidak menemukan air setelah upaya yang wajar"], 3, "Ketiadaan air setelah pencarian yang layak merupakan sebab tayamum, dengan memenuhi syaratnya."),
    soal("Tayamum juga dapat dibolehkan ketika ...", ["Penggunaan air dikhawatirkan menimbulkan bahaya yang diakui syariat", "Seseorang malas berwudhu", "Air tersedia dan aman digunakan tetapi sengaja dihindari", "Seseorang ingin melewatkan salat"], 0, "Uzur seperti sakit atau bahaya penggunaan air dapat membolehkan tayamum menurut ketentuan fikih."),
    soal("Dalam mazhab Syafi’i, media tayamum secara umum adalah ...", ["Debu atau tanah suci yang memenuhi syarat", "Minyak goreng", "Air laut", "Kain bersih saja"], 0, "Tayamum menurut mazhab Syafi’i dilakukan dengan debu yang suci dan memenuhi syarat."),
    soal("Manakah yang termasuk rukun tayamum dalam pengajaran fikih Syafi’i?", ["Mengusap pakaian saja", "Mengusap wajah dan kedua tangan dengan debu yang memenuhi syarat", "Membasuh kaki tiga kali dengan air", "Berkumur tujuh kali"], 1, "Mengusap wajah dan kedua tangan termasuk rukun tayamum; terdapat rincian niat dan tertib."),
    soal("Dalam tayamum untuk salat fardu menurut mazhab Syafi’i, niat dilakukan ...", ["Sehari setelah tayamum", "Hanya dengan mengucapkan niat keras tanpa tindakan", "Saat memindahkan atau mengusapkan debu untuk wajah, dengan niat yang sesuai", "Setelah salat selesai"], 2, "Niat tayamum dilakukan pada waktu yang ditentukan dalam tata cara tayamum."),
    soal("Apakah tayamum dapat menggantikan mandi wajib ketika air tidak dapat digunakan karena uzur yang sah?", ["Tidak pernah", "Hanya jika dilakukan dengan sabun", "Hanya untuk menggantikan zakat", "Ya, tayamum dapat menjadi pengganti sementara sesuai ketentuan"], 3, "Tayamum dapat menggantikan mandi wajib ketika syarat dan uzurnya terpenuhi."),
    soal("Jika seseorang bertayamum karena tidak ada air, kemudian menemukan air sebelum salat dan mampu menggunakannya, tindakan umumnya adalah ...", ["Menggunakan air untuk bersuci sesuai ketentuan", "Tetap tayamum dalam semua keadaan", "Membatalkan kewajiban salat", "Mengganti salat dengan sedekah"], 0, "Ketika air tersedia dan dapat digunakan sebelum salat, ketentuan tayamum karena ketiadaan air berubah; rincian waktu menemukan air dibahas dalam fikih."),
    soal("Apakah tayamum dilakukan karena sekadar ingin menghindari air tanpa uzur?", ["Ya, jika air tampak jernih", "Tidak, harus ada sebab yang dibenarkan syariat", "Ya, kapan saja tanpa syarat", "Ya, jika ingin tidur lebih cepat"], 1, "Tayamum bukan pilihan bebas ketika air tersedia dan aman digunakan."),
    soal("Apa hubungan tayamum dengan kewajiban salat?", ["Tayamum hanya berguna setelah salat", "Tayamum menggantikan semua salat selama seumur hidup", "Tayamum yang sah memungkinkan seseorang melaksanakan salat ketika ada uzur yang membolehkannya", "Tayamum menghapus kewajiban salat"], 2, "Tayamum menjadi cara bersuci untuk melaksanakan salat dalam keadaan yang dibenarkan."),
    soal("Manakah yang membatalkan tayamum karena ketiadaan air?", ["Mengucapkan salam kepada teman", "Mendengar azan", "Ditemukannya air yang dapat digunakan sebelum salat, sesuai rincian fikih", "Membaca Al-Qur’an"], 2, "Menemukan air yang bisa digunakan dapat mengakhiri kebolehan tayamum karena ketiadaan air, dengan rincian mazhab."),
    soal("Secara umum, pembatal tayamum mencakup ...", ["Membaca buku", "Berjalan beberapa langkah", "Mendengar suara hujan dari jauh", "Hal-hal yang membatalkan wudhu, serta berakhirnya uzur tertentu"], 3, "Pembatal tayamum mencakup pembatal wudhu dan hal yang mengakhiri alasan tayamum, sesuai kasusnya."),
    soal("Jika seseorang sakit dan dokter tepercaya menyatakan air membahayakan kondisinya, apa yang dapat ia lakukan?", ["Bersuci dengan tayamum jika syaratnya terpenuhi", "Meninggalkan semua salat tanpa pengganti", "Berwudhu dengan air yang membahayakan dalam semua keadaan", "Menganggap dirinya tidak lagi wajib beribadah"], 0, "Bahaya nyata dari penggunaan air dapat menjadi uzur tayamum menurut ketentuan syariat."),
    soal("Setelah tayamum, seseorang tetap harus ...", ["Mengganti salat dengan tidur", "Melaksanakan salat dengan memenuhi syarat dan rukunnya", "Menghapus semua rakaat", "Tidak membaca Al-Fatihah"], 1, "Tayamum hanya berkaitan dengan cara bersuci; syarat dan rukun salat tetap berlaku."),
    soal("Apakah tayamum berarti bahwa debu dapat digunakan untuk membersihkan semua najis pada pakaian?", ["Ya, jika debu berwarna putih", "Tidak ada perbedaan antara hadas dan najis", "Tidak; tayamum adalah cara mengangkat hadas, bukan cara umum membersihkan najis pada pakaian", "Ya, selalu"], 2, "Tayamum untuk hadas tidak otomatis menghilangkan najis yang menempel pada badan atau pakaian."),
    soal("Apa yang sebaiknya dilakukan sebelum bertayamum karena tidak menemukan air?", ["Langsung tayamum meski air berada di tangan", "Menunggu sampai waktu salat habis", "Membeli parfum", "Berusaha mencari air secara wajar sesuai keadaan dan kemampuan"], 3, "Seseorang perlu memastikan ketiadaan air sesuai kemampuan dan kondisi sebelum mengambil keringanan tayamum."),
    soal("Manakah pernyataan yang benar tentang tayamum?", ["Tayamum merupakan keringanan syariat dengan sebab dan tata cara tertentu", "Tayamum boleh dilakukan kapan saja tanpa syarat", "Tayamum menghapus kewajiban salat", "Tayamum sama persis dengan mencuci tangan"], 0, "Tayamum adalah rukhsah yang memiliki sebab, syarat, dan tata cara."),

    // Shalat
    soal("Berapa jumlah salat fardu yang wajib dikerjakan setiap hari dan malam?", ["Lima waktu", "Tiga waktu", "Empat waktu", "Enam waktu"], 0, "Salat fardu harian terdiri dari Subuh, Zuhur, Asar, Magrib, dan Isya."),
    soal("Berapa rakaat salat Subuh?", ["Lima rakaat", "Dua rakaat", "Tiga rakaat", "Empat rakaat"], 1, "Salat Subuh terdiri dari dua rakaat fardu."),
    soal("Berapa rakaat salat Zuhur?", ["Tiga rakaat", "Lima rakaat", "Empat rakaat", "Dua rakaat"], 2, "Salat Zuhur terdiri dari empat rakaat fardu."),
    soal("Berapa rakaat salat Asar?", ["Dua rakaat", "Tiga rakaat", "Enam rakaat", "Empat rakaat"], 3, "Salat Asar terdiri dari empat rakaat fardu."),
    soal("Berapa rakaat salat Magrib?", ["Tiga rakaat", "Dua rakaat", "Empat rakaat", "Lima rakaat"], 0, "Salat Magrib terdiri dari tiga rakaat fardu."),
    soal("Berapa rakaat salat Isya?", ["Lima rakaat", "Empat rakaat", "Dua rakaat", "Tiga rakaat"], 1, "Salat Isya terdiri dari empat rakaat fardu."),
    soal("Salah satu syarat sah salat adalah ...", ["Salat di tempat yang selalu ramai", "Menghafal seluruh kitab fikih", "Masuk waktu salat", "Memakai pakaian paling mahal"], 2, "Salat fardu harus dilakukan setelah masuk waktunya."),
    soal("Sebelum salat, seorang Muslim wajib memastikan kesucian dari ...", ["Semua rasa lelah", "Semua percakapan hari itu", "Hadas dan najis sesuai ketentuan", "Semua rasa lapar"], 2, "Kesucian dari hadas dan najis termasuk syarat salat."),
    soal("Menghadap kiblat ketika salat termasuk ...", ["Rukun yang hanya berlaku di Masjidil Haram", "Sunah yang tidak pernah menjadi syarat", "Pengganti wudhu", "Syarat salat bagi orang yang mampu, dengan pengecualian yang diatur syariat"], 3, "Menghadap kiblat merupakan syarat salat bagi orang yang mampu, kecuali pada keadaan yang mendapat ketentuan khusus."),
    soal("Menutup aurat ketika salat merupakan ...", ["Syarat sah salat", "Pengganti membaca Al-Fatihah", "Sunah yang tidak perlu diperhatikan", "Pembatal wudhu"], 0, "Menutup aurat dengan ketentuan yang benar merupakan syarat sah salat."),
    soal("Apa yang dimaksud dengan takbiratul ihram?", ["Salam penutup salat", "Takbir pembuka salat yang menandai dimulainya salat", "Takbir setelah selesai salat saja", "Azan sebelum salat"], 1, "Takbiratul ihram adalah takbir pembuka yang memulai salat."),
    soal("Bacaan yang menjadi rukun dalam setiap rakaat menurut mazhab Syafi’i adalah ...", ["Doa qunut pada setiap salat", "Ayat Kursi saja", "Surah Al-Fatihah", "Surah Al-Kahfi secara lengkap"], 2, "Membaca Al-Fatihah termasuk rukun salat dalam mazhab Syafi’i."),
    soal("Gerakan membungkuk dengan tangan bertumpu di lutut dalam salat disebut ...", ["Sujud", "Iktidal", "Tasyahud", "Rukuk"], 3, "Rukuk adalah gerakan membungkuk dengan tata cara tertentu."),
    soal("Berdiri kembali setelah rukuk disebut ...", ["Iktidal", "Sujud", "Tasyahud", "Salam"], 0, "Iktidal adalah bangkit dari rukuk hingga kembali tegak."),
    soal("Berapa kali sujud dilakukan dalam satu rakaat salat?", ["Dua kali", "Satu kali", "Tiga kali", "Empat kali"], 0, "Dalam setiap rakaat, salat mencakup dua kali sujud yang dipisahkan dengan duduk di antaranya."),
    soal("Apa yang dimaksud dengan tuma’ninah dalam salat?", ["Mengulang salat dari awal setiap rakaat", "Tenang sejenak pada gerakan tertentu hingga gerakan itu terlaksana dengan sempurna", "Mempercepat semua gerakan tanpa berhenti", "Membaca doa dengan suara keras"], 1, "Tuma’ninah adalah ketenangan pada rukun gerakan salat dan menjadi perkara penting dalam sahnya salat menurut banyak ulama."),
    soal("Duduk di antara dua sujud dilakukan ...", ["Sebelum takbiratul ihram", "Sebagai pengganti rukuk", "Di antara sujud pertama dan sujud kedua dalam setiap rakaat", "Hanya setelah salam"], 2, "Duduk di antara dua sujud adalah bagian dari tata cara salat."),
    soal("Salam dalam salat berfungsi untuk ...", ["Memulai wudhu", "Mengganti rukuk", "Menentukan arah kiblat", "Mengakhiri salat"], 3, "Salam merupakan penutup salat menurut tata cara yang diajarkan."),
    soal("Apa fungsi azan?", ["Memberi tahu masuknya waktu salat dan menyeru kaum Muslimin untuk salat", "Menggantikan semua salat fardu", "Menjadi pengganti wudhu", "Menandai waktu berbuka puasa saja"], 0, "Azan adalah panggilan untuk salat dan pemberitahuan waktu salat."),
    soal("Iqamah biasanya dikumandangkan untuk ...", ["Mengumumkan pembagian zakat fitrah saja", "Menandai bahwa salat berjamaah segera dimulai", "Mengakhiri bulan Ramadan", "Mengganti azan Subuh untuk selamanya"], 1, "Iqamah merupakan panggilan bahwa salat akan segera ditegakkan."),
    soal("Dalam salat berjamaah, orang yang memimpin salat disebut ...", ["Muazin", "Khatib dalam semua keadaan", "Imam", "Makmum"], 2, "Imam memimpin pelaksanaan salat berjamaah."),
    soal("Orang yang mengikuti imam dalam salat berjamaah disebut ...", ["Khatib", "Amil", "Makmum", "Muazin"], 2, "Makmum adalah orang yang mengikuti imam dalam salat berjamaah."),
    soal("Bagaimana sikap makmum ketika mengikuti gerakan imam?", ["Selalu bergerak lebih dahulu daripada imam", "Membuat urutan gerakan sendiri tanpa alasan", "Berhenti mengikuti imam setiap rakaat", "Mengikuti imam dan tidak mendahuluinya"], 3, "Makmum diperintahkan mengikuti imam, bukan mendahului gerakannya."),
    soal("Salat Jumat bagi laki-laki Muslim yang memenuhi syarat pada umumnya menggantikan ...", ["Salat Zuhur pada hari Jumat", "Salat Subuh", "Salat Magrib", "Salat Isya"], 0, "Salat Jumat menggantikan salat Zuhur bagi orang yang wajib melaksanakannya dan memenuhi syarat."),
    soal("Berapa rakaat salat Jumat yang wajib dilakukan bersama imam?", ["Satu rakaat", "Dua rakaat", "Empat rakaat", "Tiga rakaat"], 1, "Salat Jumat dilaksanakan dua rakaat setelah khutbah, dengan syarat-syaratnya."),
    soal("Salat yang dilakukan untuk meminta petunjuk Allah dalam mengambil keputusan disebut ...", ["Salat gerhana", "Salat tahiyatul masjid", "Salat istikharah", "Salat jenazah"], 2, "Salat istikharah dilakukan untuk memohon pilihan terbaik dalam perkara yang diperbolehkan."),
    soal("Salat tahiyatul masjid dikerjakan ketika ...", ["Keluar rumah untuk bekerja", "Selesai makan", "Sebelum membayar zakat", "Masuk masjid sebelum duduk, pada keadaan yang sesuai dengan ketentuannya"], 3, "Tahiyatul masjid adalah salat sunah ketika masuk masjid sebelum duduk, dengan memperhatikan kondisi dan waktu yang dilarang."),
    soal("Salat witir umumnya dilaksanakan sebagai ...", ["Salat sunah penutup salat malam", "Pengganti salat Subuh", "Pengganti salat Jumat", "Salat wajib keenam"], 0, "Witir merupakan salat sunah yang menutup salat malam menurut tuntunan yang dikenal."),
    soal("Apa yang dimaksud dengan salat qasar?", ["Meringkas salat fardu empat rakaat menjadi dua rakaat ketika memenuhi syarat safar", "Menambah rakaat salat", "Mengganti salat dengan doa", "Menggabungkan semua salat menjadi satu rakaat"], 0, "Qasar adalah meringkas salat empat rakaat menjadi dua dalam perjalanan yang memenuhi syarat."),
    soal("Salat fardu yang dapat diqasar menjadi dua rakaat ketika syarat safar terpenuhi adalah ...", ["Magrib saja", "Zuhur, Asar, dan Isya", "Subuh dan Magrib", "Subuh saja"], 1, "Salat Subuh tetap dua rakaat dan Magrib tetap tiga rakaat; Zuhur, Asar, dan Isya dapat diqasar."),
    soal("Apa yang dimaksud dengan salat jamak?", ["Menghapus kewajiban salat", "Menggabungkan salat dengan zakat", "Menggabungkan dua salat fardu dalam satu waktu sesuai ketentuan", "Menggandakan jumlah rakaat semua salat"], 2, "Jamak adalah menggabungkan pelaksanaan dua salat tertentu, dengan sebab dan syarat yang diatur fikih."),
    soal("Manakah pasangan salat yang dapat dijamak?", ["Subuh dengan Zuhur", "Asar dengan Magrib", "Isya dengan Subuh", "Zuhur dengan Asar"], 3, "Salat yang dapat dijamak adalah Zuhur dengan Asar serta Magrib dengan Isya, sesuai syaratnya."),
    soal("Jika seseorang sengaja berbicara dengan percakapan biasa ketika salat dan bukan bacaan salat, hukum umumnya adalah ...", ["Dapat membatalkan salat menurut fikih dasar", "Menjadi rukun salat", "Menyempurnakan salat", "Menggantikan salam"], 0, "Berbicara dengan sengaja di luar bacaan salat dapat membatalkan salat menurut fikih dasar."),
    soal("Makan atau minum dengan sengaja di dalam salat pada umumnya ...", ["Tidak pernah berpengaruh", "Membatalkan salat", "Menjadi sunah salat", "Menggantikan rukuk"], 1, "Makan dan minum dengan sengaja umumnya membatalkan salat."),
    soal("Apa yang sebaiknya dilakukan jika mengetahui pakaian terkena najis sebelum salat?", ["Menambah jumlah rakaat", "Membaca azan dua kali", "Membersihkan najis atau mengganti pakaian agar syarat kesucian terpenuhi", "Tetap salat tanpa memperhatikan najis"], 2, "Pakaian salat harus suci dari najis yang wajib dihilangkan."),
    soal("Sujud sahwi berkaitan dengan ...", ["Tata cara tayamum", "Pembayaran utang", "Kekeliruan atau kelupaan tertentu dalam salat", "Kewajiban zakat fitrah"], 2, "Sujud sahwi disyariatkan untuk kekeliruan atau kelupaan tertentu, dengan rincian menurut fikih."),
    soal("Salat jenazah berbeda dari salat biasa karena ...", ["Selalu terdiri dari empat rakaat dengan rukuk", "Dilakukan tanpa takbir", "Tidak membutuhkan niat", "Tidak memiliki rukuk dan sujud"], 3, "Salat jenazah dilakukan dengan takbir dan doa tanpa rukuk maupun sujud."),
    soal("Apa yang dilakukan saat mendengar azan sebagai sikap yang dianjurkan?", ["Menjawab lafaz azan sesuai tuntunan dan bersiap untuk salat", "Mengabaikan salat selamanya", "Makan dengan sengaja di masjid", "Mengubah jumlah rakaat"], 0, "Menjawab azan dan bersiap menuju salat merupakan adab yang dianjurkan."),
    soal("Manakah contoh salat sunah rawatib?", ["Salat yang hanya dilakukan saat gerhana", "Salat sunah yang mengiringi salat fardu sebelum atau sesudahnya", "Salat jenazah saja", "Salat yang menggantikan semua salat wajib"], 1, "Rawatib adalah salat sunah yang mengiringi salat fardu pada waktu-waktu tertentu."),
    soal("Apa yang sebaiknya dilakukan ketika seseorang tidak mampu berdiri dalam salat fardu karena sakit?", ["Meminta orang lain menggantikan semua salatnya tanpa alasan", "Menunggu sembuh tanpa salat dalam semua keadaan", "Salat sesuai kemampuan, misalnya duduk jika tidak mampu berdiri", "Meninggalkan salat selamanya"], 2, "Orang sakit melaksanakan salat sesuai kemampuan; syariat memberi keringanan pada tata caranya."),
    soal("Salat yang dilakukan pada malam hari di bulan Ramadan secara berjamaah dan dikenal dengan nama tarawih adalah ...", ["Salat fardu keenam", "Salat yang menggantikan Subuh", "Salat jenazah", "Salat sunah Ramadan"], 3, "Tarawih merupakan salat sunah yang dikenal dilaksanakan pada malam Ramadan."),
    soal("Rukun salat dilakukan ...", ["Dengan urutan yang sesuai dan tidak sengaja ditinggalkan", "Secara acak agar lebih cepat", "Hanya jika dilihat orang lain", "Sebagai pilihan yang tidak wajib"], 0, "Rukun salat harus ditunaikan menurut tata cara yang sah; meninggalkan rukun memiliki konsekuensi fikih."),
    soal("Tujuan utama salat dalam kehidupan seorang Muslim adalah ...", ["Beribadah kepada Allah dan menjalankan kewajiban yang ditetapkan-Nya", "Memperoleh pujian manusia saja", "Menggantikan seluruh akhlak baik", "Menjadi sarana merendahkan orang lain"], 0, "Salat merupakan ibadah kepada Allah dan bagian pokok dari pengamalan Islam."),
    soal("Apabila tertinggal salat karena tertidur tanpa sengaja, prinsip umum yang diajarkan adalah ...", ["Menunggu Ramadan berikutnya", "Melaksanakan salat ketika teringat atau bangun", "Tidak perlu melaksanakannya lagi", "Mengganti dengan sedekah saja"], 1, "Hadis mengajarkan agar orang yang tertidur atau lupa salat melaksanakannya ketika ingat."),
    soal("Manakah yang termasuk adab penting dalam salat?", ["Mengganggu orang di sebelah", "Sengaja mengabaikan imam", "Khusyuk dan menjaga ketenangan gerakan", "Berlomba menyelesaikan salat paling cepat tanpa tuma’ninah"], 2, "Khusyuk dan ketenangan membantu menjaga kualitas dan tata cara salat."),

    // Puasa
    soal("Apa pengertian puasa dalam ibadah Ramadan?", ["Tidak makan hanya saat siang tanpa niat", "Tidur sepanjang hari", "Tidak berbicara selama sebulan", "Menahan diri dari hal-hal yang membatalkan sejak terbit fajar hingga terbenam matahari disertai niat"], 3, "Puasa dilakukan dengan niat dan menahan diri dari pembatal puasa dalam rentang waktu yang ditentukan."),
    soal("Bulan yang diwajibkan untuk berpuasa bagi Muslim yang memenuhi syarat adalah ...", ["Ramadan", "Syawal seluruh bulan secara wajib", "Muharam seluruh bulan secara wajib", "Rajab seluruh bulan secara wajib"], 0, "Puasa Ramadan adalah kewajiban bagi Muslim yang memenuhi syarat."),
    soal("Dalam mazhab Syafi’i, niat puasa wajib Ramadan untuk setiap hari umumnya dilakukan ...", ["Hanya pada akhir Ramadan", "Pada malam hari sebelum fajar", "Setelah matahari terbenam pada hari itu", "Sesudah berbuka"], 1, "Dalam mazhab Syafi’i, niat puasa wajib Ramadan dilakukan pada malam hari sebelum fajar untuk tiap hari."),
    soal("Salah satu rukun puasa adalah ...", ["Tidur siang", "Membaca buku tertentu", "Niat puasa", "Makan sahur sampai kenyang"], 2, "Niat termasuk rukun puasa dalam pembahasan fikih."),
    soal("Sahur adalah ...", ["Makanan yang wajib dimakan agar puasa sah", "Makan ketika azan Magrib", "Makan atau minum menjelang fajar sebagai persiapan puasa", "Makan setelah matahari terbenam"], 2, "Sahur adalah makan atau minum sebelum fajar; hukumnya sunah dan mengandung keberkahan."),
    soal("Kapan waktu berbuka puasa Ramadan?", ["Tepat saat tengah hari", "Ketika matahari terbit", "Sebelum masuk waktu Zuhur", "Setelah matahari terbenam"], 3, "Puasa hari itu berakhir ketika matahari terbenam."),
    soal("Jika seseorang makan karena lupa bahwa ia sedang berpuasa, hukum puasanya menurut hadis yang masyhur adalah ...", ["Tetap sah dan ia melanjutkan puasanya ketika ingat", "Pasti batal dan harus membayar kafarat", "Batal dan tidak boleh melanjutkan puasa", "Puasa berubah menjadi zakat"], 0, "Orang yang makan atau minum karena lupa diperintahkan melanjutkan puasanya ketika ingat."),
    soal("Makan atau minum dengan sengaja pada siang hari Ramadan tanpa uzur yang dibenarkan ...", ["Tidak pernah berpengaruh", "Membatalkan puasa", "Menyempurnakan puasa", "Menjadi syarat sah puasa"], 1, "Makan atau minum dengan sengaja termasuk pembatal puasa."),
    soal("Seseorang yang sedang berpuasa sengaja melakukan hubungan suami istri pada siang Ramadan. Hal itu ...", ["Menjadi sunah puasa", "Hanya mengurangi pahala tanpa rincian lain", "Membatalkan puasa dan dapat menimbulkan konsekuensi hukum berat sesuai ketentuan fikih", "Tidak berpengaruh sama sekali"], 2, "Hubungan suami istri dengan sengaja pada siang Ramadan termasuk pembatal puasa dan memiliki konsekuensi fikih khusus."),
    soal("Muntah yang terjadi tanpa disengaja ketika berpuasa pada umumnya ...", ["Selalu membatalkan puasa", "Mewajibkan zakat fitrah saat itu juga", "Mengganti salat Jumat", "Tidak membatalkan puasa jika tidak disengaja dan tidak ada tindakan pembatal lain"], 3, "Muntah tidak disengaja pada umumnya tidak membatalkan puasa; rincian perlu diperhatikan jika ada tindakan sengaja."),
    soal("Perempuan yang sedang haid pada siang Ramadan ...", ["Tidak berpuasa dan mengqadha hari yang ditinggalkan setelah Ramadan", "Tetap wajib meneruskan puasa agar sah", "Mengqadha salat, tetapi tidak puasa", "Tidak pernah wajib mengganti puasa"], 0, "Puasa tidak dilaksanakan saat haid; hari puasa Ramadan yang ditinggalkan wajib diqadha."),
    soal("Orang yang sakit dan puasa dapat memperburuk penyakitnya memiliki ...", ["Keringanan untuk tidak berpuasa sesuai ketentuan, kemudian mengqadha jika diwajibkan", "Kewajiban berpuasa apa pun akibatnya", "Larangan untuk berobat", "Kewajiban membayar zakat setiap hari dalam semua keadaan"], 0, "Syariat memberi rukhsah kepada orang sakit; penggantian puasa mengikuti kondisi dan ketentuan fikih."),
    soal("Musafir yang memenuhi ketentuan keringanan puasa Ramadan ...", ["Otomatis tidak wajib mengqadha puasa", "Dapat mengambil rukhsah tidak berpuasa dan mengqadha di hari lain", "Selalu dilarang berbuka", "Tidak perlu salat selama perjalanan"], 1, "Musafir dapat memperoleh keringanan puasa dengan ketentuan yang diatur syariat, lalu mengqadha hari yang ditinggalkan."),
    soal("Apa yang dimaksud qadha puasa?", ["Melakukan salat sunah", "Menyegerakan berbuka", "Mengganti puasa wajib yang ditinggalkan dengan berpuasa pada hari lain", "Membayar harga makanan saja dalam semua keadaan"], 2, "Qadha adalah mengerjakan kewajiban puasa yang ditinggalkan pada hari lain sesuai ketentuan."),
    soal("Apa yang dimaksud fidyah dalam pembahasan puasa?", ["Nama salat wajib", "Jenis air wudhu", "Denda untuk setiap salat yang terlambat", "Penggantian dalam bentuk pemberian makanan kepada orang miskin pada keadaan tertentu yang ditetapkan fikih"], 3, "Fidyah berkaitan dengan keadaan tertentu yang diatur fikih; penerapannya bergantung pada sebab dan mazhab."),
    soal("Puasa sunah pada hari Senin dan Kamis dikenal sebagai ...", ["Puasa Senin-Kamis", "Puasa wajib keenam", "Puasa yang menggantikan zakat", "Puasa yang hanya boleh dilakukan Ramadan"], 0, "Puasa Senin dan Kamis termasuk puasa sunah yang dikenal dalam ajaran Islam."),
    soal("Puasa enam hari di bulan Syawal adalah ...", ["Rukun haji", "Puasa sunah", "Puasa wajib bagi semua Muslim tanpa pengecualian", "Pengganti salat Id"], 1, "Puasa enam hari di bulan Syawal dikenal sebagai puasa sunah."),
    soal("Hari raya Idulfitri adalah hari yang ...", ["Hanya boleh berpuasa bagi anak-anak", "Menggantikan puasa Ramadan", "Dilarang berpuasa", "Wajib berpuasa penuh"], 2, "Puasa pada hari Idulfitri dilarang dalam fikih."),
    soal("Hari raya Iduladha juga merupakan hari yang ...", ["Menjadi hari qadha khusus", "Tidak memiliki aturan ibadah", "Dilarang berpuasa", "Wajib puasa bagi semua orang"], 2, "Berpuasa pada hari Iduladha dilarang menurut ketentuan fikih."),
    soal("Mengakhirkan sahur hingga mendekati fajar tanpa melewati waktunya merupakan ...", ["Syarat yang membuat puasa tidak sah", "Pembatal puasa", "Pengganti niat", "Perbuatan yang dianjurkan"], 3, "Mengakhirkan sahur selama belum melewati fajar termasuk sunah."),
    soal("Menyegerakan berbuka setelah matahari terbenam termasuk ...", ["Sunah", "Pembatal puasa", "Syarat wajib zakat", "Perbuatan yang dilarang"], 0, "Menyegerakan berbuka ketika waktu telah masuk termasuk tuntunan sunah."),
    soal("Apa tujuan utama puasa menurut Al-Qur’an dalam pembahasan yang masyhur?", ["Supaya seseorang dipuji", "Membentuk ketakwaan", "Agar manusia tidak pernah bekerja", "Untuk menggantikan semua kewajiban lain"], 1, "QS Al-Baqarah ayat 183 mengaitkan kewajiban puasa dengan tujuan ketakwaan."),
    soal("Jika seseorang berkumur ketika berwudhu saat berpuasa, sikap yang tepat adalah ...", ["Sengaja menelan air", "Tidak boleh membasuh mulut sama sekali", "Tidak berlebihan agar air tidak tertelan", "Memasukkan air sebanyak mungkin"], 2, "Orang yang berpuasa boleh berkumur, tetapi dianjurkan tidak berlebihan agar air tidak masuk ke tenggorokan."),
    soal("Puasa bukan hanya menahan makan dan minum, tetapi juga melatih ...", ["Menyakiti orang lain", "Meninggalkan semua pekerjaan", "Menghina orang yang tidak berpuasa", "Menjaga akhlak, ucapan, dan perilaku"], 3, "Puasa juga mendidik pengendalian diri dan akhlak yang baik."),
    soal("Lailatulqadar terutama dicari pada ...", ["Sepuluh malam terakhir Ramadan", "Sepuluh hari pertama Muharam", "Hari raya Idulfitri", "Bulan Safar saja"], 0, "Lailatulqadar dicari pada sepuluh malam terakhir Ramadan, terutama malam-malam ganjil menurut banyak riwayat."),
    soal("Orang lanjut usia yang secara menetap tidak mampu berpuasa dan tidak diharapkan mampu menurut ketentuan fikih dapat memiliki kewajiban ...", ["Fidyah sesuai ketentuan yang berlaku", "Mengqadha semua hari dalam keadaan apa pun", "Tidak melakukan apa pun dalam semua keadaan", "Membayar zakat mal setiap hari"], 0, "Fidyah dibahas untuk orang yang tidak mampu berpuasa secara permanen; penerapannya mengikuti ketentuan fikih."),
    soal("Apabila seseorang tertelan air tanpa sengaja ketika berkumur secara wajar, apa yang perlu dipahami?", ["Ia wajib meninggalkan semua ibadah", "Rincian hukumnya perlu dilihat dalam fikih; ia tidak boleh sengaja menelan air dan harus berhati-hati", "Sengaja menelan air selalu dianjurkan", "Puasa otomatis berubah menjadi puasa sunah"], 1, "Kasus tertelan tanpa sengaja memiliki rincian fikih; kehati-hatian tetap dianjurkan dan sengaja menelan membatalkan puasa."),
    soal("Puasa Ramadan yang ditinggalkan karena haid wajib ...", ["Tidak pernah diganti", "Diganti dengan salat sunah saja", "Diqadha pada hari lain", "Dibayar sebagai zakat mal"], 2, "Hari puasa Ramadan yang ditinggalkan karena haid wajib diqadha."),
    soal("Manakah contoh puasa yang dilarang?", ["Puasa Senin", "Puasa Arafah bagi orang yang tidak sedang berhaji, menurut anjuran umum", "Puasa enam hari Syawal", "Puasa pada hari Idulfitri"], 3, "Puasa pada hari Idulfitri termasuk puasa yang dilarang."),
    soal("Bagaimana sikap yang benar jika berbuka karena mengira matahari sudah terbenam, tetapi ternyata belum?", ["Perlu mengikuti hukum fikih terkait kekeliruan waktu; tidak boleh sengaja berbuka sebelum waktunya", "Tidak ada aturan apa pun", "Berbuka sebelum terbenam adalah sunah", "Tidak perlu mempelajari waktu salat"], 0, "Kesalahan dalam menentukan waktu berbuka memiliki rincian hukum dalam fikih; berbuka harus didasarkan pada masuknya waktu magrib."),

    // Zakat
    soal("Apa pengertian zakat secara umum?", ["Hadiah yang selalu bersifat pilihan", "Mengeluarkan bagian harta tertentu atau menunaikan kewajiban tertentu kepada golongan yang berhak sesuai syariat", "Memberi pinjaman dengan bunga", "Membayar semua belanja harian"], 1, "Zakat adalah ibadah harta dengan aturan kadar, syarat, dan penerima tertentu."),
    soal("Apa perbedaan utama zakat fitrah dan zakat mal?", ["Keduanya selalu dibayar dengan jumlah yang sama", "Zakat mal hanya boleh dikeluarkan pada Idulfitri", "Zakat fitrah berkaitan dengan akhir Ramadan dan jiwa, sedangkan zakat mal berkaitan dengan harta yang memenuhi syarat", "Zakat fitrah hanya untuk kendaraan dan zakat mal hanya untuk makanan"], 2, "Zakat fitrah dan zakat mal berbeda dalam sebab, objek, waktu, dan ketentuan."),
    soal("Kapan zakat fitrah umumnya wajib ditunaikan?", ["Setiap selesai salat Subuh sepanjang tahun", "Hanya pada hari Jumat", "Pada akhir Ramadan sebelum salat Idulfitri menurut waktu yang ditentukan fikih", "Hanya pada bulan Muharam"], 2, "Zakat fitrah berkaitan dengan akhir Ramadan; waktu terbaiknya sebelum salat Id menurut banyak penjelasan fikih."),
    soal("Apa tujuan sosial zakat fitrah yang sering dijelaskan?", ["Menggantikan salat Id", "Membuat semua orang kaya sama rata seketika", "Menghapus kewajiban bekerja", "Membantu orang yang membutuhkan dan menyempurnakan ibadah puasa"], 3, "Zakat fitrah memiliki dimensi ibadah dan kepedulian sosial terhadap orang yang membutuhkan."),
    soal("Zakat fitrah di banyak pedoman Indonesia umumnya ditunaikan dalam bentuk ...", ["Makanan pokok setempat atau nilai uang menurut ketentuan/pedoman yang diikuti", "Barang mewah yang tidak dapat digunakan", "Benda najis", "Utang berbunga"], 0, "Banyak pedoman menetapkan zakat fitrah berupa makanan pokok; pembayaran dengan uang diperselisihkan dan mengikuti panduan ulama atau otoritas setempat."),
    soal("Apa yang dimaksud nisab dalam zakat mal?", ["Jenis puasa sunah", "Batas minimum harta yang menjadi salah satu syarat wajib zakat", "Nama penerima zakat", "Waktu salat wajib"], 1, "Nisab adalah batas minimum harta yang menjadi salah satu syarat zakat pada jenis harta tertentu."),
    soal("Apa yang dimaksud haul dalam banyak pembahasan zakat mal?", ["Waktu berbuka puasa", "Kadar zakat fitrah per keluarga", "Kepemilikan harta selama satu tahun hijriah untuk jenis harta yang disyaratkan haul", "Jumlah penerima zakat"], 2, "Haul adalah masa kepemilikan satu tahun hijriah yang menjadi syarat untuk beberapa jenis harta, bukan semuanya."),
    soal("Kadar zakat yang umum dikenal untuk uang simpanan yang memenuhi syarat nisab dan haul adalah ...", ["1%", "10% untuk semua jenis harta", "50%", "2,5%"], 3, "Kadar 2,5% lazim digunakan untuk emas, perak, uang, dan perdagangan ketika seluruh syaratnya terpenuhi; jenis harta lain memiliki ketentuan berbeda."),
    soal("Apakah seluruh jenis harta zakat selalu mensyaratkan haul?", ["Tidak; misalnya hasil pertanian memiliki ketentuan waktu zakat yang berbeda", "Ya, semuanya wajib menunggu satu tahun", "Tidak ada zakat harta yang mensyaratkan haul", "Haul hanya berlaku untuk zakat fitrah"], 0, "Haul berlaku untuk sejumlah jenis harta, sedangkan hasil pertanian memiliki waktu pengeluaran zakat tersendiri."),
    soal("Manakah contoh harta yang dapat menjadi objek zakat mal jika syaratnya terpenuhi?", ["Uang simpanan", "Setiap barang pinjaman milik orang lain tanpa hak", "Udara yang dihirup", "Barang haram yang tidak dapat dizakati sebagai harta halal"], 0, "Uang simpanan dapat menjadi objek zakat mal jika memenuhi persyaratan yang ditentukan."),
    soal("Berapa golongan penerima zakat yang disebutkan dalam QS At-Taubah ayat 60?", ["Sepuluh golongan", "Delapan golongan", "Empat golongan", "Enam golongan"], 1, "QS At-Taubah ayat 60 menyebut delapan golongan penerima zakat."),
    soal("Manakah yang termasuk golongan penerima zakat?", ["Semua pedagang tanpa syarat", "Setiap orang yang meminta tanpa melihat ketentuan", "Fakir dan miskin", "Orang kaya yang tidak termasuk kategori penerima"], 2, "Fakir dan miskin termasuk golongan penerima zakat yang disebutkan dalam Al-Qur’an."),
    soal("Amil zakat adalah ...", ["Orang yang menerima bunga pinjaman", "Orang yang wajib selalu membayar fidyah", "Pedagang yang menetapkan harga pasar", "Pihak yang bertugas mengelola zakat sesuai ketentuan"], 3, "Amil adalah pihak yang diberi tugas mengelola zakat sesuai ketentuan syariat."),
    soal("Ibnusabil dalam kategori penerima zakat secara umum merujuk kepada ...", ["Musafir yang kehabisan bekal dalam perjalanan yang dibenarkan", "Semua orang yang mempunyai rumah", "Orang yang berutang karena semua keperluan mewah", "Pemilik semua usaha besar"], 0, "Ibnusabil dibahas sebagai musafir yang membutuhkan bantuan bekal, dengan rincian fikih."),
    soal("Gharimin sebagai penerima zakat adalah ...", ["Hanya pemilik bank", "Orang yang memiliki utang memenuhi kriteria yang diakui syariat", "Setiap orang yang sengaja menipu", "Orang yang tidak pernah memiliki utang"], 1, "Gharimin adalah orang berutang yang memenuhi syarat sebagai penerima zakat."),
    soal("Zakat fitrah pada dasarnya berkaitan dengan ...", ["Hanya hasil panen padi", "Hanya pedagang emas", "Setiap jiwa Muslim yang memenuhi ketentuan kewajiban", "Hanya kendaraan keluarga"], 2, "Zakat fitrah berhubungan dengan jiwa, bukan kadar keuntungan dagang."),
    soal("Siapa yang pada prinsipnya menanggung zakat fitrah anak kecil yang belum memiliki harta sendiri menurut banyak penjelasan fikih?", ["Anak itu wajib mencari pinjaman berbunga", "Tidak ada ketentuan apa pun", "Wali atau orang yang berkewajiban menanggung nafkahnya, sesuai ketentuan mazhab", "Tetangga yang paling dekat dalam semua keadaan"], 2, "Kewajiban zakat fitrah anak ditanggung pihak yang berkewajiban menurut rincian fikih dan mazhab."),
    soal("Apakah zakat sama dengan sedekah sukarela?", ["Ya, keduanya selalu wajib dengan kadar sama", "Zakat hanya ucapan, sedekah hanya tulisan", "Sedekah dilarang dalam Islam", "Tidak; zakat adalah kewajiban dengan ketentuan khusus, sedangkan sedekah sukarela lebih luas"], 3, "Zakat memiliki syarat dan penerima tertentu; sedekah sunah lebih luas bentuk dan waktunya."),
    soal("Apa yang sebaiknya dilakukan sebelum menghitung zakat mal?", ["Memastikan jenis harta, kepemilikan, nisab, haul jika disyaratkan, dan kadar yang berlaku", "Menghitung semua barang milik orang lain", "Memilih angka secara acak", "Menunggu tanpa memeriksa apa pun"], 0, "Perhitungan zakat mengikuti jenis harta dan syarat yang terkait dengannya."),
    soal("Zakat hasil pertanian umumnya dikaitkan dengan ...", ["Saat barang dijual di luar negeri saja", "Saat panen, dengan kadar sesuai cara pengairan dan ketentuan fikih", "Wajib menunggu lima tahun", "Hari raya Idulfitri saja"], 1, "Zakat hasil pertanian memiliki waktu dan kadar khusus; pengairan alami dan berbiaya dapat memengaruhi kadarnya."),
    soal("Jika harta belum mencapai nisab, secara umum ...", ["Otomatis menjadi zakat fitrah", "Harus diberikan seluruhnya kepada amil", "Belum wajib zakat mal atas jenis harta yang mensyaratkan nisab itu", "Tetap wajib 50%"], 2, "Nisab merupakan salah satu syarat wajib untuk banyak jenis zakat mal."),
    soal("Manakah sikap yang benar saat menyalurkan zakat?", ["Memberikannya untuk membeli hal haram", "Menggunakannya sebagai dana pribadi amil tanpa hak", "Menyembunyikan catatan pengelolaan jika bertugas sebagai amil", "Menyalurkannya kepada penerima yang memenuhi kategori syariat"], 3, "Zakat harus disalurkan dengan amanah kepada golongan yang berhak."),
    soal("Mengapa zakat dapat memperkuat solidaritas sosial?", ["Karena harta disalurkan kepada golongan yang berhak dan membantu memenuhi kebutuhan mereka", "Karena semua orang harus memperoleh jumlah yang sama persis", "Karena zakat menghapus semua perbedaan ekonomi secara otomatis", "Karena zakat menggantikan kewajiban bekerja"], 0, "Zakat membantu memenuhi kebutuhan kelompok yang berhak dan memperkuat tanggung jawab sosial."),
    soal("Apakah zakat mal dan zakat fitrah selalu boleh ditunda tanpa alasan?", ["Tidak; masing-masing memiliki waktu dan ketentuan penunaian yang harus diperhatikan", "Ya, keduanya boleh ditunda selamanya", "Ya, karena semua zakat hanya sunah", "Tidak ada ketentuan waktu untuk zakat"], 0, "Zakat memiliki ketentuan waktu dan tidak boleh sengaja ditunda tanpa alasan yang dibenarkan."),
    soal("Jika seseorang tidak yakin apakah hartanya sudah mencapai nisab, sikap paling bertanggung jawab adalah ...", ["Mengikuti perhitungan orang yang tidak memahami zakat", "Menghitung dengan cermat dan bertanya kepada ahli zakat yang tepercaya", "Menentukan jumlah dengan menebak", "Langsung menyebut semua hartanya bukan objek zakat"], 1, "Ketika ragu tentang perhitungan, lakukan pencatatan dan konsultasikan kepada pihak berilmu."),

    // Muamalah
    soal("Apa yang dibahas dalam fikih muamalah dasar?", ["Sejarah peperangan saja", "Gerakan salat saja", "Aturan hubungan dan transaksi antarmanusia, terutama dalam urusan harta dan hak", "Tata cara membaca huruf saja"], 2, "Fikih muamalah membahas hubungan dan transaksi, termasuk jual beli, sewa, utang, dan amanah."),
    soal("Prinsip penting dalam transaksi yang dibenarkan adalah ...", ["Penipuan jika menguntungkan", "Menyembunyikan semua cacat barang", "Memaksa pihak lain tanpa hak", "Kerelaan para pihak, kejujuran, dan tidak menzalimi"], 3, "Kerelaan, kejujuran, keadilan, dan bebas dari unsur terlarang merupakan prinsip muamalah."),
    soal("Dalam jual beli, kerelaan para pihak berarti ...", ["Penjual dan pembeli melakukan transaksi tanpa paksaan yang tidak dibenarkan", "Salah satu pihak dipaksa menyerahkan barang", "Harga sengaja disembunyikan dari pembeli", "Barang selalu harus diberikan gratis"], 0, "Transaksi perlu berlangsung atas dasar persetujuan yang sah dan tanpa paksaan yang melanggar hak."),
    soal("Manakah yang termasuk unsur pokok jual beli dalam pengajaran fikih dasar?", ["Nama jalan tempat toko", "Pihak yang bertransaksi, objek, dan kesepakatan transaksi", "Hanya warna toko", "Jumlah pengunjung pasar"], 1, "Jual beli melibatkan pihak-pihak yang berakad, objek transaksi, dan bentuk kesepakatan sesuai ketentuan."),
    soal("Barang yang diperjualbelikan seharusnya ...", ["Barang yang bukan milik atau kuasa penjual dalam semua keadaan", "Barang haram tanpa pengecualian", "Halal, jelas, bernilai manfaat yang dibenarkan, dan dapat diserahkan", "Tidak diketahui jenisnya sama sekali"], 2, "Objek jual beli perlu memenuhi syarat seperti kejelasan, manfaat yang dibenarkan, dan kemampuan penyerahan."),
    soal("Apa yang dimaksud riba secara ringkas dalam muamalah?", ["Semua hadiah sukarela", "Setiap kenaikan harga barang karena kualitas lebih baik", "Tambahan terlarang dalam transaksi tertentu yang ditetapkan syariat", "Semua keuntungan jual beli"], 2, "Riba adalah tambahan terlarang pada bentuk transaksi tertentu, bukan setiap keuntungan perdagangan."),
    soal("Manakah contoh yang paling jelas dari riba dalam pinjaman?", ["Pembeli membayar harga barang yang disepakati", "Penjual menerima laba dari jual beli halal", "Seseorang memberi hadiah tanpa syarat", "Pemberi pinjaman mensyaratkan pengembalian lebih besar karena pinjaman itu"], 3, "Tambahan yang disyaratkan atas pinjaman karena pinjaman itu termasuk contoh riba dalam pembahasan fikih."),
    soal("Apa makna gharar dalam transaksi?", ["Ketidakjelasan atau risiko berlebihan pada unsur penting transaksi", "Kejujuran dalam menimbang", "Pembayaran tunai yang jelas", "Pemberian hadiah setelah jual beli"], 0, "Gharar berkaitan dengan ketidakjelasan yang berlebihan pada unsur penting transaksi dan dapat membuat akad terlarang."),
    soal("Apa yang dimaksud maysir?", ["Pemberian sedekah", "Perjudian atau transaksi yang berbasis taruhan untung-untungan yang terlarang", "Jual beli barang yang jelas", "Pembayaran sewa rumah"], 1, "Maysir berarti perjudian atau taruhan terlarang yang bergantung pada untung-untungan."),
    soal("Seorang penjual mengetahui barangnya cacat tetapi sengaja menyembunyikannya dari pembeli. Perbuatan ini ...", ["Menjadi syarat sah jual beli", "Tidak berkaitan dengan kejujuran", "Termasuk kecurangan dan bertentangan dengan etika muamalah", "Selalu diwajibkan dalam jual beli"], 2, "Menyembunyikan cacat material merupakan bentuk penipuan yang bertentangan dengan kejujuran dalam transaksi."),
    soal("Menimbang barang dengan ukuran yang benar merupakan bentuk ...", ["Gharar yang dianjurkan", "Riba pinjaman", "Maysir", "Kejujuran dan pemenuhan hak pembeli"], 3, "Takaran dan timbangan yang benar menjaga hak para pihak dan merupakan etika jual beli."),
    soal("Apa yang dimaksud akad ijarah?", ["Akad pemindahan hak manfaat melalui sewa atau upah sesuai ketentuan", "Akad pemberian pinjaman berbunga", "Akad perjudian", "Akad menukar barang tanpa persetujuan"], 0, "Ijarah adalah akad atas manfaat dengan imbalan, seperti sewa rumah atau jasa dengan upah."),
    soal("Dalam akad mudharabah, secara umum ...", ["Satu pihak menyediakan modal dan pihak lain mengelola usaha dengan pembagian hasil sesuai kesepakatan", "Kedua pihak selalu menjamin keuntungan tetap tanpa risiko", "Semua modal berubah menjadi sedekah", "Pengelola usaha wajib membayar bunga tetap kepada pemilik modal"], 0, "Mudharabah adalah kerja sama antara pemilik modal dan pengelola; keuntungan dibagi menurut nisbah yang disepakati, dengan aturan kerugian sesuai sebab dan ketentuan akad."),
    soal("Apa yang dimaksud musyarakah?", ["Hadiah tanpa penerima", "Kerja sama usaha ketika para pihak menyertakan modal sesuai kesepakatan", "Pinjaman yang wajib berbunga", "Penjualan barang cacat tanpa penjelasan"], 1, "Musyarakah merupakan kerja sama usaha dengan penyertaan modal dari para mitra."),
    soal("Akad qardh dalam fikih muamalah umumnya berarti ...", ["Sewa kendaraan", "Pemberian zakat fitrah", "Pinjaman yang wajib dikembalikan setara sesuai ketentuan, tanpa tambahan yang disyaratkan sebagai manfaat pinjaman", "Jual beli dengan keuntungan tak terbatas"], 2, "Qardh adalah pinjaman; tambahan yang dipersyaratkan untuk pemberi pinjaman karena pinjaman itu menjadi persoalan riba."),
    soal("Apa pengertian amanah dalam transaksi?", ["Mengambil barang orang lain tanpa izin", "Menyembunyikan catatan transaksi", "Mengingkari kesepakatan dengan sengaja", "Menjaga hak, barang, atau tanggung jawab yang dipercayakan"], 3, "Amanah menuntut seseorang menjaga titipan dan memenuhi tanggung jawabnya."),
    soal("Wadiah dalam fikih muamalah berkaitan dengan ...", ["Titipan yang harus dijaga sesuai ketentuan", "Perjudian", "Pembayaran zakat pertanian", "Salat berjamaah"], 0, "Wadiah adalah akad titipan; pihak yang menerima titipan memiliki kewajiban sesuai ketentuan akad."),
    soal("Wakalah adalah akad ...", ["Puasa sunah", "Perwakilan atau pemberian kuasa untuk melakukan tindakan yang boleh diwakilkan", "Pinjaman berbunga", "Jual beli yang objeknya tidak jelas"], 1, "Wakalah berarti perwakilan atau pemberian kuasa dalam urusan yang boleh diwakilkan."),
    soal("Rahn dalam muamalah adalah ...", ["Jual beli tanpa harga", "Pemberian zakat fitrah", "Penahanan barang sebagai jaminan utang sesuai ketentuan", "Hadiah ulang tahun"], 2, "Rahn adalah gadai atau penjaminan dengan barang, mengikuti ketentuan syariat."),
    soal("Dalam jual beli, harga dan barang sebaiknya diketahui dengan jelas agar terhindar dari ...", ["Sedekah", "Wakalah", "Gharar yang merugikan", "Amanah"], 2, "Kejelasan harga dan objek mengurangi sengketa dan gharar yang berlebihan."),
    soal("Menjual barang yang belum dimiliki atau belum berada dalam kuasa penjual dapat ...", ["Selalu dibolehkan dalam setiap keadaan", "Selalu menjadi sedekah", "Menggantikan pembayaran", "Menjadi masalah keabsahan akad, bergantung pada bentuk transaksi dan ketentuan yang berlaku"], 3, "Kemampuan memiliki atau menyerahkan barang penting dalam banyak bentuk jual beli; sejumlah akad khusus memiliki aturan tersendiri."),
    soal("Apa yang dimaksud ihtikar dalam pembahasan muamalah?", ["Penimbunan barang yang dibutuhkan untuk memanipulasi kelangkaan atau merugikan masyarakat", "Memberi diskon kepada pembeli", "Menabung uang untuk kebutuhan", "Menjaga barang titipan"], 0, "Ihtikar mengacu pada penimbunan dengan tujuan yang merugikan pasar atau masyarakat, dengan rincian dalam fikih."),
    soal("Penjual dan pembeli sebaiknya membuat kesepakatan harga ...", ["Hanya berdasarkan tebakan pihak ketiga", "Sebelum transaksi selesai, dengan jelas dan atas dasar kerelaan", "Setelah barang diambil tanpa memberi tahu pembeli", "Secara sengaja tidak jelas"], 1, "Kejelasan harga dan kesepakatan membantu mencegah sengketa dalam jual beli."),
    soal("Manakah contoh transaksi yang mengandung unsur perjudian?", ["Menyewa rumah dengan kontrak jelas", "Menerima upah setelah pekerjaan selesai", "Membayar taruhan dengan harapan memperoleh uang dari hasil acak yang dipertaruhkan", "Membeli buku dengan harga yang diketahui"], 2, "Taruhan yang bergantung pada hasil untung-untungan merupakan bentuk maysir."),
    soal("Apa prinsip Islam terkait pemenuhan kontrak yang sah?", ["Melanggar akad ketika tidak ada yang melihat", "Mengubah harga sepihak setelah transaksi selesai tanpa hak", "Menyembunyikan kewajiban dari mitra", "Memenuhi kesepakatan dan tanggung jawab yang telah disetujui"], 3, "Memenuhi akad dan janji yang sah merupakan bagian dari etika serta kewajiban muamalah."),
    soal("Ketika menerima uang titipan, sikap yang benar adalah ...", ["Menjaga dan mengembalikannya kepada pemilik sesuai kesepakatan", "Menggunakannya untuk diri sendiri tanpa izin", "Menganggapnya hadiah otomatis", "Memberikannya kepada orang lain tanpa alasan"], 0, "Titipan harus dijaga dan dikembalikan sesuai hak pemilik dan ketentuan akad."),
    soal("Jika pembeli menemukan cacat barang yang tidak diberitahukan, tindakan yang tepat adalah ...", ["Berkomunikasi secara jujur dan menyelesaikan hak sesuai aturan transaksi dan fikih", "Langsung mengambil barang lain tanpa izin", "Menyebarkan kebohongan tentang penjual", "Menganggap cacat selalu tidak penting"], 0, "Hak pembeli atas cacat barang dibahas dalam fikih; penyelesaian hendaknya jujur dan sesuai akad serta ketentuan yang berlaku."),
    soal("Dalam transaksi digital, prinsip muamalah yang sama tetap perlu dijaga, yaitu ...", ["Menyamarkan biaya wajib", "Kejelasan barang, harga, persetujuan, keamanan data, dan kejujuran", "Menghilangkan semua informasi produk", "Membolehkan penipuan karena dilakukan daring"], 1, "Media digital tidak menghapus prinsip kejujuran, kejelasan, persetujuan, dan larangan transaksi yang terlarang."),
    soal("Apa sikap yang tepat ketika tidak memahami hukum suatu transaksi baru?", ["Langsung menganggap semua transaksi haram tanpa memeriksa", "Mengikuti rumor tanpa memastikan fakta", "Memeriksa detail akad dan bertanya kepada ahli fikih muamalah yang kompeten", "Langsung menganggap semua transaksi halal"], 2, "Transaksi modern perlu dianalisis berdasarkan detail akad dan dirujukkan kepada ahli yang kompeten bila diperlukan."),
    soal("Tujuan penting aturan muamalah adalah ...", ["Membolehkan pemaksaan dalam transaksi", "Menghapus hak kepemilikan", "Mendorong penipuan untuk memperoleh keuntungan", "Menjaga keadilan, hak, kerelaan, dan mencegah kezaliman dalam hubungan antarmanusia"], 3, "Fikih muamalah bertujuan menata hubungan dan transaksi agar hak dijaga serta kezaliman dihindari."),
  ],
  tauhid: [
    soal('Allah adalah Tuhan Yang Maha …', ['Esa', 'Dua', 'Tiga', 'Banyak'], 0, 'Allah Maha Esa, tidak ada sekutu bagi-Nya.'),
    soal('Surah yang menjelaskan keesaan Allah adalah?', ['Al-Ikhlas', 'Al-Masad', 'Al-Kafirun', 'Al-Falaq'], 0, 'Surah Al-Ikhlas menegaskan Allah Maha Esa.'),
    soal('Syirik artinya?', ['Menyekutukan Allah', 'Mengesakan Allah', 'Bersyukur kepada Allah', 'Berdoa kepada Allah'], 0, 'Syirik adalah menyekutukan Allah dengan sesuatu.'),
    soal('Berapa jumlah rukun iman?', ['4', '5', '6', '7'], 2, 'Rukun iman ada enam.'),
    soal('Rukun iman yang pertama adalah iman kepada?', ['Allah', 'Malaikat', 'Kitab-kitab', 'Rasul'], 0, 'Iman kepada Allah menjadi rukun iman pertama.'),
    soal('Kalimat tauhid adalah?', ['Laa ilaaha illallah', 'Alhamdulillah', 'Subhanallah', 'Allahu Akbar'], 0, 'Artinya: tiada tuhan selain Allah.'),
    soal('Makhluk Allah yang diciptakan dari cahaya adalah?', ['Malaikat', 'Manusia', 'Jin', 'Hewan'], 0, 'Malaikat diciptakan dari cahaya.'),
    soal("Kitab suci yang diturunkan kepada Nabi Muhammad ﷺ adalah?", ['Taurat', 'Zabur', 'Injil', "Al-Qur'an"], 3, "Al-Qur'an diturunkan kepada Nabi Muhammad ﷺ."),
    soal('Malaikat yang bertugas menyampaikan wahyu adalah?', ['Jibril', 'Mikail', 'Israfil', 'Izrail'], 0, 'Jibril menyampaikan wahyu kepada para nabi.'),
    soal('Jin diciptakan dari?', ['Tanah', 'Api', 'Cahaya', 'Air'], 1, 'Jin diciptakan dari api.'),
    soal('Beriman kepada hari akhir berarti percaya akan datangnya?', ['Hari kiamat', 'Hari raya', 'Hari libur', 'Hari lahir'], 0, 'Seluruh makhluk akan dibangkitkan pada hari kiamat.'),
    soal("Asmaul husna yang berarti Maha Mendengar adalah?", ["As-Sami'", 'Al-Bashir', 'Al-Alim', 'Al-Khaliq'], 0, "As-Sami' berarti Maha Mendengar."),
      soal('Apa yang dimaksud dengan tauhid rububiyah?', ['Mengesakan Allah dalam ibadah', 'Meyakini Allah sebagai satu-satunya Rabb yang mencipta dan mengatur', 'Menghafal seluruh nama malaikat', 'Meneladani seluruh kebiasaan masyarakat'], 1, 'Tauhid rububiyah berkaitan dengan keyakinan bahwa Allah satu-satunya Pencipta, Pemilik, dan Pengatur alam semesta.'),
    soal('Manakah contoh keyakinan yang sesuai dengan tauhid rububiyah?', ['Bintang menentukan nasib secara mandiri', 'Manusia menciptakan alam tanpa pertolongan siapa pun', 'Allah yang menghidupkan, mematikan, dan memberi rezeki', 'Setiap benda memiliki kekuasaan ketuhanan sendiri'], 2, 'Dalam tauhid rububiyah, Allah diyakini sebagai satu-satunya Rabb yang menghidupkan, mematikan, dan memberi rezeki.'),
    soal('Tauhid rububiyah terutama membahas keyakinan tentang ....', ['perbuatan Allah sebagai Rabb', 'tata cara perdagangan', 'sejarah kerajaan Arab', 'aturan bahasa Arab'], 0, 'Rububiyah berkaitan dengan perbuatan Allah dalam menciptakan, memiliki, dan mengatur makhluk.'),
    soal('Pernyataan bahwa bintang mempunyai kekuasaan mandiri untuk mendatangkan musibah bertentangan dengan ....', ['adab bertamu', 'tauhid rububiyah', 'ilmu nahwu', 'tata cara membaca'], 1, 'Meyakini makhluk memiliki kekuasaan ketuhanan secara mandiri bertentangan dengan tauhid rububiyah.'),
    soal('Apa perbedaan mempelajari sebab alamiah dengan meyakini makhluk memiliki kuasa ketuhanan mandiri?', ['Keduanya selalu sama', 'Mempelajari sebab alamiah otomatis syirik', 'Sebab alamiah tidak boleh dipelajari', 'Mempelajari sebab alamiah tidak sama dengan memberi makhluk kuasa ketuhanan mandiri'], 3, 'Materi membedakan penelitian sebab-sebab alamiah dari keyakinan bahwa makhluk memiliki kuasa ketuhanan mandiri.'),
    soal('Keyakinan Islam tentang siapa Pencipta seluruh makhluk adalah ....', ['Allah', 'bintang-bintang', 'para malaikat sebagai pencipta mandiri', 'manusia secara keseluruhan'], 0, 'Dalam tauhid rububiyah, Allah adalah satu-satunya Pencipta seluruh makhluk.'),
    soal('Pandangan yang menolak keberadaan Tuhan dan pencipta ilahi disebut ....', ['politeisme', 'ateisme', 'tawakal', 'riya'], 1, 'Ateisme, dalam bentuk yang dijelaskan dalam materi, menolak keberadaan Tuhan atau pencipta ilahi.'),
    soal('Politeisme secara umum merujuk pada kepercayaan bahwa ....', ['tidak ada nilai moral', 'semua makhluk sama persis', 'terdapat lebih dari satu tuhan', 'ibadah tidak memiliki arti'], 2, 'Politeisme adalah kepercayaan terhadap beberapa tuhan atau sesembahan yang dianggap memiliki kuasa ketuhanan.'),

    // Tauhid Uluhiyah
    soal('Apa pengertian tauhid uluhiyah?', ['Mengesakan Allah dalam seluruh ibadah', 'Meyakini semua makhluk memiliki kuasa sama', 'Mempelajari perubahan cuaca', 'Mengingat peristiwa sejarah'], 0, 'Tauhid uluhiyah berarti mengesakan Allah dalam seluruh ibadah.'),
    soal('Menurut materi, ibadah harus ditujukan kepada ....', ['orang yang paling terkenal', 'makhluk yang dianggap sakti', 'Allah semata', 'siapa pun yang diminta masyarakat'], 2, 'Dalam tauhid uluhiyah, semua bentuk ibadah ditujukan kepada Allah semata.'),
    soal('Manakah yang termasuk contoh ibadah dalam materi?', ['berjalan menuju sekolah', 'salat', 'mempelajari peta', 'menanam pohon untuk panen'], 1, 'Salat disebut sebagai salah satu contoh ibadah yang ditujukan kepada Allah.'),
    soal('Seseorang melakukan ritual penghambaan kepada sesembahan selain Allah karena meyakininya berhak atas ibadah. Ini bertentangan dengan ....', ['tauhid uluhiyah', 'ilmu aritmetika', 'aturan lalu lintas', 'ilmu geografi'], 0, 'Mengarahkan ibadah kepada selain Allah bertentangan dengan tauhid uluhiyah.'),
    soal('Nazar ibadah dan penyembelihan sebagai ritual ibadah termasuk perkara yang harus ditujukan kepada ....', ['tokoh yang dihormati', 'leluhur', 'makhluk yang dimintai perlindungan', 'Allah'], 3, 'Materi menyebut nazar ibadah dan penyembelihan ritual sebagai contoh ibadah yang ditujukan kepada Allah.'),
    soal('Apa pokok persoalan politeisme dalam kaitannya dengan tauhid uluhiyah?', ['Menghafal istilah bahasa', 'Mengarahkan ibadah kepada beberapa sesembahan', 'Menata administrasi sekolah', 'Mengembangkan ilmu kedokteran'], 1, 'Politeisme bertentangan dengan tauhid uluhiyah ketika ibadah diarahkan kepada beberapa sesembahan.'),
    soal('Mengapa niat penting dalam pelaksanaan ibadah?', ['Karena ibadah harus ditujukan kepada Allah dan dilakukan dengan ikhlas', 'Karena pujian manusia adalah tujuan utama', 'Karena niat membuat aturan agama tidak diperlukan', 'Karena ibadah selalu dilakukan untuk memperoleh popularitas'], 0, 'Ibadah ditujukan kepada Allah; niat ikhlas membedakannya dari perbuatan yang semata-mata mencari pujian.'),
    soal('Kalimat yang paling tepat menggambarkan tauhid uluhiyah adalah ....', ['Allah menciptakan alam, tetapi ibadah bebas ditujukan kepada siapa saja', 'Semua makhluk wajib disembah', 'Hanya Allah yang berhak menerima ibadah', 'Ibadah hanya berupa kegiatan sosial'], 2, 'Tauhid uluhiyah menegaskan bahwa hanya Allah yang berhak diibadahi.'),

    // Tauhid Asma wa Sifat
    soal('Apa yang dimaksud dengan tauhid asma wa sifat?', ['Mengesakan Allah dalam ibadah saja', 'Mengimani nama dan sifat Allah yang diterangkan dalam Al-Qur’an dan Sunnah secara layak bagi-Nya', 'Menyamakan sifat Allah dengan manusia', 'Menolak semua pembahasan tentang nama Allah'], 1, 'Tauhid asma wa sifat mengimani nama dan sifat Allah berdasarkan wahyu, sesuai dengan keagungan-Nya.'),
    soal('QS. Asy-Syura ayat 11 menegaskan bahwa ....', ['Allah sama seperti makhluk', 'semua makhluk memiliki sifat ketuhanan', 'tidak ada sesuatu pun yang serupa dengan Allah', 'nama Allah tidak dapat disebutkan'], 2, 'Ayat tersebut menyatakan tidak ada sesuatu pun yang serupa dengan Allah, dan Dia Maha Mendengar lagi Maha Melihat.'),
    soal('Sikap yang harus dihindari dalam memahami sifat Allah adalah ....', ['mengimani berdasarkan wahyu', 'mengagungkan Allah', 'menyadari bahwa Allah tidak serupa dengan makhluk', 'menyerupakan Allah dengan sifat makhluk'], 3, 'Materi menegaskan bahwa sifat Allah tidak boleh disamakan dengan sifat makhluk.'),
    soal('Dalam sumber teologi klasik, Jahmiyah sering dikaitkan dengan ....', ['penolakan sifat-sifat Allah', 'pengembangan armada laut', 'penetapan kalender Hijriah', 'pembahasan hukum waris saja'], 0, 'Menurut ringkasan materi, Jahmiyah sering dikaitkan dengan penolakan sifat-sifat Allah.'),
    soal('Apa gambaran umum pendekatan Mu’tazilah terhadap sifat Allah dalam materi?', ['Meyakini banyak tuhan', 'Menolak keberadaan Allah', 'Menolak pemahaman sifat kekal sebagai entitas terpisah dari Zat-Nya', 'Meyakini setiap benda memiliki sifat ketuhanan'], 2, 'Materi menjelaskan bahwa Mu’tazilah menekankan keesaan Allah dan memiliki pendekatan khusus terhadap sifat-sifat-Nya.'),
    soal('Istilah Musyabbihah atau Mujassimah dalam materi digunakan sebagai istilah kritik bagi pandangan yang ....', ['menekankan pendidikan', 'menyerupakan Allah dengan makhluk atau menggambarkan-Nya dengan ciri jasmani makhluk', 'menetapkan kalender', 'membahas perdagangan'], 1, 'Istilah tersebut digunakan dalam polemik teologis bagi pandangan yang menyerupakan Allah dengan makhluk.'),
    soal('Pernyataan yang paling tepat mengenai Asy’ariyah dan Maturidiyah adalah ....', ['keduanya selalu menyamakan Allah dengan makhluk', 'keduanya menolak seluruh ajaran Islam', 'keduanya tidak pernah membahas sifat Allah', 'keduanya mazhab teologi Sunni dengan pendekatan berbeda dalam memahami sejumlah sifat Allah'], 3, 'Materi menekankan bahwa Asy’ariyah dan Maturidiyah mempunyai pendekatan teologis tersendiri dan tidak tepat disamakan begitu saja dengan kelompok penyerupaan.'),
    soal('Pendekatan yang mengalihkan makna suatu sifat dalam pembahasan teologi sering disebut ....', ['takwil', 'hijrah', 'zakat', 'qiyas bahasa'], 0, 'Takwil merupakan salah satu pendekatan yang digunakan dalam sebagian pembahasan sifat-sifat Allah.'),
    soal('Mengapa pembahasan kelompok teologi tentang sifat Allah perlu dipelajari secara teliti?', ['Agar semua perbedaan dianggap sama', 'Karena semua sumber sejarah tidak memiliki nilai', 'Karena sejarahnya panjang dan masing-masing kelompok memiliki rincian pandangan', 'Agar seseorang bebas menuduh siapa pun'], 2, 'Materi mengingatkan bahwa perdebatan sifat Allah memiliki sejarah panjang dan pandangan kelompok tidak selalu sederhana.'),
    soal('Apa sikap dasar yang ditegaskan materi ketika mengenal nama dan sifat Allah?', ['Membayangkan Allah seperti manusia', 'Mengimani berdasarkan wahyu dan tidak menyerupakan-Nya dengan makhluk', 'Menjadikan pendapat pribadi satu-satunya sumber', 'Menolak semua ayat tentang sifat'], 1, 'Nama dan sifat Allah diimani melalui wahyu dengan mengagungkan Allah dan tidak menyerupakan-Nya dengan makhluk.'),

    // Syirik
    soal('Apa pengertian syirik dalam ringkasan materi?', ['Meninggalkan pekerjaan rumah', 'Tidak mengetahui sejarah', 'Menyekutukan Allah dalam sesuatu yang menjadi kekhususan-Nya, terutama ibadah dan ketuhanan', 'Mempelajari alam'], 2, 'Syirik adalah menyekutukan Allah dalam ketuhanan atau ibadah yang menjadi kekhususan-Nya.'),
    soal('Syirik akbar secara umum adalah ....', ['syirik besar yang bertentangan dengan dasar tauhid', 'semua kesalahan kecil tanpa pengecualian', 'perbedaan bahasa', 'kesalahan hitung'], 0, 'Syirik akbar bertentangan dengan dasar tauhid; penetapan hukum terhadap individu tetap memerlukan ketentuan dan kehati-hatian.'),
    soal('Contoh yang diberikan untuk syirik akbar adalah ....', ['belajar untuk ujian', 'menolong tetangga', 'berolahraga', 'mengarahkan ibadah kepada sesembahan selain Allah'], 3, 'Mengarahkan ibadah kepada sesembahan lain merupakan contoh syirik akbar dalam materi.'),
    soal('Riya dalam bentuk yang dikategorikan ulama sebagai syirik kecil berkaitan dengan ....', ['belajar secara tekun', 'beribadah agar dipuji manusia', 'membantu tanpa pamrih', 'menjaga kebersihan'], 1, 'Riya berarti melakukan ibadah demi mendapatkan pujian atau penilaian manusia.'),
    soal('Istilah syirik khafi merujuk pada syirik yang ....', ['hanya terjadi dalam sejarah kuno', 'selalu terlihat oleh semua orang', 'tersembunyi atau halus', 'berarti tidak mengenal bahasa Arab'], 2, 'Syirik khafi berarti syirik yang tersembunyi atau halus, sering dibahas dalam konteks keikhlasan.'),
    soal('Seorang siswa bersedekah untuk menolong orang lain karena Allah. Bagaimana penilaian umum terhadap niat ini menurut materi?', ['Niat tersebut baik dan berorientasi kepada Allah', 'Pasti termasuk syirik akbar', 'Tidak boleh bersedekah', 'Sedekah hanya boleh dilakukan agar dikenal'], 0, 'Materi menyebut sedekah dengan niat menolong karena Allah sebagai amal yang baik.'),
    soal('Mengapa tidak tepat menetapkan seseorang sebagai musyrik hanya berdasarkan dugaan atau nama kelompok?', ['Karena semua perbuatan pasti benar', 'Karena syirik tidak pernah dibahas ulama', 'Karena semua pendapat selalu sama', 'Karena penilaian membutuhkan pemahaman konteks dan dasar yang jelas'], 3, 'Materi melarang menetapkan seseorang sebagai musyrik berdasarkan dugaan, nama kelompok, atau tindakan yang konteksnya belum dipahami.'),
    soal('QS. An-Nisa ayat 48 dalam materi dijadikan dalil tentang ....', ['kewajiban berdagang', 'beratnya dosa syirik dan perbedaannya dari dosa lain yang berada di bawah kehendak ampunan Allah', 'tata cara perjalanan', 'sejarah bahasa Arab'], 1, 'Materi menjelaskan bahwa ayat tersebut menegaskan beratnya dosa syirik dan membedakannya dari dosa lain yang berada di bawah kehendak ampunan Allah.'),
    soal('Perbuatan yang dilakukan semata-mata supaya orang menganggap pelakunya saleh menunjukkan masalah dalam ....', ['ilmu falak', 'perdagangan', 'keikhlasan dan niat ibadah', 'pengukuran suhu'], 2, 'Riya berkaitan dengan tujuan memperoleh pujian manusia sehingga merusak keikhlasan ibadah.'),
    soal('Pernyataan yang benar tentang syirik asghar adalah ....', ['tidak otomatis mengeluarkan seseorang dari Islam', 'selalu sama hukumnya dengan semua bentuk syirik akbar', 'tidak berkaitan dengan niat', 'berarti semua dosa adalah syirik'], 0, 'Syirik kecil tidak otomatis mengeluarkan seseorang dari Islam, berbeda dari syirik akbar dalam pembahasan hukum.'),

    // Iman
    soal('Menurut rumusan yang umum digunakan banyak ulama Ahlus Sunnah, iman mencakup ....', ['harta dan keturunan saja', 'keyakinan hati, ucapan, dan amal', 'ucapan tanpa keyakinan dan amal', 'pengetahuan sejarah saja'], 1, 'Dalam rumusan yang disebut materi, iman mencakup keyakinan hati, ucapan, dan amal.'),
    soal('Menurut penjelasan Ahlus Sunnah dalam materi, iman dapat ....', ['bertambah saja tanpa mungkin berkurang', 'berkurang saja tanpa mungkin bertambah', 'bertambah dan berkurang', 'diukur hanya dengan kekayaan'], 2, 'Materi menyebut iman dapat bertambah dan berkurang menurut penjelasan banyak ulama Ahlus Sunnah.'),
    soal('Manakah yang termasuk enam pokok keimanan yang disebutkan dalam materi?', ['iman kepada warna dan bentuk', 'iman kepada kekayaan', 'iman kepada bintang sebagai penentu nasib', 'iman kepada qada dan qadar'], 3, 'Enam pokok iman meliputi iman kepada Allah, malaikat, kitab, rasul, hari akhir, serta qada dan qadar.'),
    soal('Hadis Sahih al-Bukhari yang disebut dalam materi menyatakan iman memiliki ....', ['lebih dari enam puluh cabang, termasuk rasa malu', 'hanya satu cabang', 'cabang yang tidak ada kaitan dengan akhlak', 'cabang yang hanya terkait perdagangan'], 0, 'Materi menyebut hadis tentang iman memiliki lebih dari enam puluh cabang, termasuk rasa malu.'),
    soal('QS. Al-Anfal ayat 2 disebut dalam materi berkaitan dengan keterangan bahwa ....', ['iman tidak pernah berubah', 'iman dapat bertambah ketika ayat Allah dibacakan', 'iman hanya diukur dari kekayaan', 'amal tidak pernah dibahas'], 1, 'Ayat tersebut menjelaskan bahwa ketika ayat-ayat Allah dibacakan, iman orang beriman bertambah.'),
    soal('Kelompok Khawarij dalam sebagian rumusan historis dikenal karena ....', ['menolak semua bentuk ibadah', 'menganggap amal tidak penting sama sekali', 'mengafirkan pelaku dosa besar', 'meyakini banyak pencipta'], 2, 'Dalam sumber teologi klasik, kelompok Khawarij tertentu dikenal karena sikap ekstrem dalam mengafirkan pelaku dosa besar.'),
    soal('Konsep al-manzilah bayna al-manzilatayn dikaitkan dengan ....', ['Jabariyah', 'Qadariyah', 'Jahmiyah', 'Mu’tazilah'], 3, 'Mu’tazilah mengajarkan konsep posisi di antara dua posisi bagi pelaku dosa besar dalam kehidupan dunia.'),
    soal('Sebagian formulasi Murji’ah dikritik karena ....', ['menekankan pentingnya amal secara berlebihan', 'memisahkan amal dari hakikat iman secara berlebihan', 'menolak adanya sejarah', 'menganggap semua ilmu dilarang'], 1, 'Materi menyebut bahwa sebagian formulasi Murji’ah memisahkan amal dari hakikat iman secara berlebihan menurut kritik ulama lain.'),
    soal('Mengapa gambaran tentang kelompok teologi perlu menyebut bahwa ada variasi internal?', ['Karena setiap kelompok tidak pernah berubah', 'Agar satu tokoh mewakili semua orang sepanjang sejarah', 'Karena kelompok-kelompok tersebut memiliki perkembangan dan ragam pandangan', 'Agar perbedaan sejarah diabaikan'], 2, 'Materi mengingatkan bahwa masing-masing kelompok memiliki perkembangan serta variasi pemikiran internal.'),
    soal('Pernyataan yang paling sesuai dengan materi tentang iman adalah ....', ['iman tidak berkaitan dengan ucapan maupun amal menurut semua ulama', 'iman hanya berarti pengakuan sosial', 'iman tidak memiliki pokok-pokok', 'iman mencakup pokok kepercayaan dan tercermin dalam ucapan serta amal menurut rumusan Ahlus Sunnah yang disebut'], 3, 'Materi menjelaskan pokok keimanan serta rumusan Ahlus Sunnah yang mencakup hati, ucapan, dan amal.'),

    // Kufur
    soal('Apa pengertian umum kufur dalam materi?', ['penolakan atau pengingkaran terhadap kebenaran iman', 'kegiatan menuntut ilmu', 'perbuatan menolong sesama', 'semua bentuk perbedaan pendapat'], 0, 'Kufur secara umum berkaitan dengan penolakan atau pengingkaran terhadap kebenaran iman.'),
    soal('Kufur akbar merujuk pada ....', ['kesalahan hitung', 'kekufuran yang bertentangan dengan pokok iman', 'semua kekurangan dalam belajar', 'setiap perbedaan kebiasaan'], 1, 'Kufur akbar adalah kekufuran yang bertentangan dengan pokok iman.'),
    soal('Istilah kufur nikmat digunakan dalam sebagian pembahasan untuk ....', ['menghafal nama-nama tempat', 'menunaikan amanah', 'mengingkari nikmat Allah tanpa otomatis berarti keluar dari Islam', 'menghormati orang tua'], 2, 'Kufur kecil atau kufur nikmat mengacu pada pengingkaran nikmat dan tidak otomatis berarti keluar dari Islam.'),
    soal('Apakah setiap dosa besar otomatis membuat seorang Muslim keluar dari Islam?', ['Ya, selalu', 'Ya, tanpa perlu memahami konteks', 'Hanya jika ada orang yang menuduh', 'Tidak; melakukan maksiat tidak otomatis berarti keluar dari Islam'], 3, 'Materi secara tegas menyatakan tidak setiap dosa besar merupakan kufur akbar.'),
    soal('Sikap Khawarij terhadap pelaku dosa besar dipandang berlebihan oleh banyak ulama karena ....', ['mereka menyamakan semua amal dengan ilmu', 'mereka cenderung mengafirkan pelaku dosa besar', 'mereka menetapkan kalender Hijriah', 'mereka menekankan musyawarah'], 1, 'Dalam sejarah teologi, sikap mengafirkan pelaku dosa besar secara umum dipandang berlebihan oleh banyak ulama.'),
    soal('Apa sikap yang tepat ketika membahas hukum kufur terhadap orang tertentu?', ['berhati-hati dan merujuk kepada ilmu serta ulama yang kompeten', 'menjatuhkan penilaian berdasarkan rumor', 'menganggap semua perbedaan sebagai kufur', 'mengabaikan keadaan orang yang dinilai'], 0, 'Penilaian kepada individu membutuhkan kehati-hatian, pengetahuan tentang keadaannya, dan penjelasan ulama kompeten.'),
    soal('Pernyataan “semua kesalahan adalah kufur akbar” menurut materi adalah ....', ['kesimpulan yang diwajibkan', 'definisi syahadat', 'pernyataan yang keliru', 'arti tawakal'], 2, 'Materi membedakan kufur akbar dari kufur kecil dan menegaskan bahwa tidak setiap dosa adalah kufur akbar.'),
    soal('Perbedaan antara kufur akbar dan kufur kecil dalam materi terutama terletak pada ....', ['waktu pelaksanaan', 'bahasa yang digunakan', 'tempat tinggal seseorang', 'kategori dan konsekuensi keagamaan yang dibahas ulama'], 3, 'Materi membahas beberapa kategori kufur yang tidak memiliki konsekuensi hukum yang sama.'),
    soal('Menggunakan nikmat untuk kesombongan dan tidak mengakui nikmat Allah adalah contoh yang diberikan untuk ....', ['kufur nikmat', 'tauhid uluhiyah', 'tawakal yang benar', 'syahadat kedua'], 0, 'Materi memberi contoh kufur nikmat berupa tidak mengakui nikmat Allah dan menggunakannya untuk kesombongan.'),
    soal('Mengapa pengafiran individu tidak boleh dilakukan sembarangan?', ['karena seluruh perbuatan pasti dibenarkan', 'karena diperlukan pemahaman syarat, keadaan, dan penjelasan ahli ilmu', 'karena iman tidak memiliki arti', 'karena semua kelompok memiliki pandangan sama'], 1, 'Materi menekankan kehati-hatian dan kompetensi ilmu dalam penerapan hukum kepada orang tertentu.'),

    // Tawakal dan Takdir
    soal('Apa pengertian tawakal dalam materi?', ['meninggalkan semua usaha', 'menganggap manusia menguasai hasil sepenuhnya', 'bersandar kepada Allah setelah melakukan usaha yang benar', 'menolak doa'], 2, 'Tawakal adalah bersandar kepada Allah setelah melakukan usaha yang benar dan dibenarkan agama.'),
    soal('QS. Ali ‘Imran ayat 159 dalam materi dikaitkan dengan perintah untuk ....', ['bertawakal setelah membulatkan tekad', 'berhenti membuat keputusan', 'menolak musyawarah', 'mengabaikan usaha'], 0, 'Ayat ini disebut sebagai dalil untuk bertawakal kepada Allah setelah membulatkan tekad.'),
    soal('Manakah contoh tawakal yang benar?', ['tidak belajar lalu mengaku tawakal', 'belajar dengan sungguh-sungguh, berdoa, lalu menyerahkan hasil kepada Allah', 'menolak semua bantuan', 'meyakini hasil hanya ditentukan manusia'], 1, 'Tawakal tidak meniadakan usaha; seseorang berikhtiar dengan benar lalu menyerahkan hasil kepada Allah.'),
    soal('Pemahaman bahwa seseorang tidak perlu berusaha sama sekali karena mengaku bertawakal adalah ....', ['definisi iman', 'contoh syahadat', 'contoh tawakal yang sempurna', 'pemahaman tawakal yang keliru'], 3, 'Materi menyebut tidak mau berusaha tetapi mengaku tawakal sebagai pemahaman yang keliru.'),
    soal('Dalam gambaran teologi klasik, Jabariyah cenderung menekankan ....', ['kekuasaan mandiri manusia sepenuhnya', 'keterpaksaan manusia oleh takdir hingga pilihan dianggap sangat terbatas', 'penolakan semua bentuk ibadah', 'pengumpulan mushaf'], 1, 'Jabariyah dalam ringkasan klasik sering digambarkan menekankan keterpaksaan manusia secara berlebihan.'),
    soal('Qadariyah dalam gambaran ringkas materi dikenal karena menekankan ....', ['kebebasan dan tanggung jawab manusia', 'bahwa semua makhluk adalah tuhan', 'penolakan semua kitab', 'bahwa ibadah hanya untuk manusia'], 0, 'Qadariyah historis menekankan kebebasan dan tanggung jawab manusia, meskipun sejumlah rumusan awal dikritik dalam persoalan takdir.'),
    soal('Apa pelajaran penting dari pembahasan Jabariyah dan Qadariyah?', ['semua persoalan takdir sederhana dan tidak memiliki variasi', 'label kelompok selalu menggambarkan semua individu', 'persoalan takdir kompleks dan label sejarah tidak selalu mewakili setiap individu', 'usaha tidak memiliki arti sama sekali'], 2, 'Materi mengingatkan bahwa persoalan takdir lebih kompleks daripada dua kategori dan label kelompok tidak selalu mewakili semua individu.'),
    soal('Keyakinan bahwa keberhasilan sepenuhnya berasal dari kemampuan manusia tanpa mengakui kekuasaan Allah merupakan ....', ['tawakal ideal', 'makna syahadat pertama', 'contoh iman kepada malaikat', 'pemahaman yang keliru tentang tawakal dan ketergantungan kepada Allah'], 3, 'Materi menandai anggapan bahwa keberhasilan sepenuhnya ditentukan manusia sebagai pemahaman tawakal yang keliru.'),
    soal('Apa hubungan antara ikhtiar dan tawakal?', ['ikhtiar dan tawakal selalu bertentangan', 'ikhtiar dilakukan dengan benar, lalu hasil diserahkan kepada Allah', 'tawakal berarti memastikan hasil sesuai keinginan', 'ikhtiar hanya dilakukan jika tidak beriman'], 1, 'Tawakal menggabungkan usaha yang benar dengan penyerahan hasil kepada Allah.'),
    soal('Seseorang mengakui bahwa ia bertanggung jawab atas pilihannya sekaligus meyakini kekuasaan Allah. Sikap ini lebih sesuai dengan ....', ['keseimbangan ikhtiar dan tawakal', 'penolakan takdir', 'politeisme', 'riya'], 0, 'Materi menolak pemahaman yang meniadakan usaha manusia maupun yang menafikan kekuasaan Allah.'),

    // Syahadat
    soal('Syahadat terdiri dari berapa kesaksian dasar?', ['satu', 'dua', 'tiga', 'empat'], 1, 'Syahadat terdiri dari dua kalimat kesaksian: tentang keesaan Allah dan kerasulan Muhammad ﷺ.'),
    soal('Apa makna “Asyhadu an lā ilāha illallāh”?', ['Aku bersaksi bahwa semua makhluk adalah tuhan', 'Aku bersaksi bahwa tidak ada kewajiban beribadah', 'Aku bersaksi bahwa tidak ada sesembahan yang berhak diibadahi selain Allah', 'Aku bersaksi bahwa semua pendapat sama'], 2, 'Kalimat pertama syahadat menyatakan tidak ada sesembahan yang berhak diibadahi selain Allah.'),
    soal('Apa makna “Wa asyhadu anna Muḥammadan rasūlullāh”?', ['Aku bersaksi bahwa Muhammad adalah utusan Allah', 'Aku bersaksi bahwa Muhammad adalah pencipta alam', 'Aku bersaksi bahwa manusia tidak memerlukan petunjuk', 'Aku bersaksi bahwa ibadah bebas ditujukan kepada siapa saja'], 0, 'Kalimat kedua syahadat menyatakan bahwa Muhammad ﷺ adalah utusan Allah.'),
    soal('Dua pokok utama yang ditegaskan syahadat adalah ....', ['harta dan jabatan', 'perdagangan dan pertanian', 'sejarah dan geografi', 'mengesakan Allah dan membenarkan kerasulan Nabi Muhammad ﷺ'], 3, 'Syahadat menegaskan tauhid dan pengakuan terhadap kerasulan Nabi Muhammad ﷺ.'),
    soal('Menganggap syahadat hanya bunyi ucapan tanpa memahami kesaksiannya adalah ....', ['pemahaman yang lengkap', 'pemahaman yang keliru', 'inti dari tawakal', 'contoh tauhid rububiyah saja'], 1, 'Materi menyebut anggapan bahwa syahadat sekadar bunyi ucapan sebagai kekeliruan.'),
    soal('Mengapa tidak benar menganggap setiap orang yang berdosa otomatis membatalkan syahadatnya?', ['karena syahadat hanya untuk sejarah', 'karena semua dosa dibenarkan', 'karena dosa tidak otomatis berarti seseorang keluar dari Islam', 'karena ibadah tidak penting'], 2, 'Materi menegaskan bahwa melakukan dosa tidak otomatis membatalkan syahadat atau mengeluarkan seseorang dari Islam.'),
    soal('Kelompok sejarah yang dijadikan contoh sikap berlebihan dalam mengafirkan pelaku dosa besar adalah ....', ['Khawarij', 'Anshar', 'Muhajirin', 'para ahli bahasa'], 0, 'Khawarij merupakan contoh sejarah bagi sikap berlebihan dalam mengafirkan pelaku dosa besar.'),
    soal('Sikap yang tepat terhadap orang yang berbeda pendapat dalam masalah akidah adalah ....', ['langsung mengafirkan', 'menyebarkan tuduhan tanpa bukti', 'menolak mempelajari konteks', 'berhati-hati dan tidak menjatuhkan tuduhan tanpa dasar'], 3, 'Materi memperingatkan agar perbedaan pendapat tidak berubah menjadi tuduhan tanpa dasar.'),

    // Kelompok Teologi dan Perbandingan
    soal('Kelompok yang dalam sumber teologi klasik sering dikaitkan dengan penolakan sifat Allah adalah ....', ['Qadariyah', 'Jahmiyah', 'Khawarij', 'Murji’ah'], 1, 'Jahmiyah sering dikaitkan dengan penolakan sifat-sifat Allah dalam sumber teologi klasik.'),
    soal('Kelompok yang dikenal dengan konsep al-manzilah bayna al-manzilatayn adalah ....', ['Jabariyah', 'Murji’ah', 'Mu’tazilah', 'Musyabbihah'], 2, 'Konsep posisi di antara dua posisi bagi pelaku dosa besar dikaitkan dengan Mu’tazilah.'),
    soal('Kelompok yang sebagian formulasi ajarannya dikritik karena memisahkan amal dari iman secara berlebihan adalah ....', ['Murji’ah', 'Jahmiyah', 'Qadariyah', 'Musyabbihah'], 0, 'Materi menyebut sebagian formulasi Murji’ah dikritik karena memisahkan amal dari iman secara berlebihan.'),
    soal('Dalam ringkasan klasik, perdebatan utama Jabariyah dan Qadariyah berkaitan dengan ....', ['cara membaca peta', 'aturan perdagangan', 'pembentukan kalender', 'takdir dan ikhtiar manusia'], 3, 'Jabariyah dan Qadariyah sering dibahas dalam kaitan dengan takdir, kebebasan, dan tanggung jawab manusia.'),
    soal('Istilah Musyabbihah/Mujassimah terutama muncul dalam perdebatan tentang ....', ['pembagian harta warisan', 'sifat Allah dan penyerupaan dengan makhluk', 'penetapan bulan hijriah', 'metode pertanian'], 1, 'Istilah tersebut berkaitan dengan tuduhan atau kritik mengenai penyerupaan Allah dengan makhluk.'),
    soal('Pernyataan yang benar tentang nama kelompok dalam sejarah teologi adalah ....', ['semua istilah netral dan selalu dipakai kelompok itu sendiri', 'semua kelompok memiliki satu pandangan tanpa variasi', 'sebagian nama merupakan sebutan polemis dari pihak lain', 'nama kelompok dapat menggantikan kajian sumber'], 2, 'Materi mengingatkan bahwa sebagian nama kelompok bersifat polemis dan perlu dibaca dalam konteks sejarah.'),
    soal('Mazhab teologi Sunni yang disebut memiliki pendekatan berbeda dalam memahami sejumlah sifat Allah adalah ....', ['Asy’ariyah dan Maturidiyah', 'Khawarij dan Qadariyah saja', 'Politeisme dan ateisme', 'Jabariyah dan kaum musyrik saja'], 0, 'Materi menyebut Asy’ariyah dan Maturidiyah sebagai mazhab teologi Sunni dengan pendekatan tersendiri tentang sejumlah sifat Allah.'),
    soal('Politeisme berkaitan dengan persoalan tauhid karena ....', ['mendorong pengembangan ilmu hitung', 'merupakan nama lain dari tawakal', 'hanya berarti perbedaan bahasa', 'meyakini lebih dari satu tuhan atau mengarahkan ibadah kepada sesembahan selain Allah'], 3, 'Politeisme bertentangan dengan pengesaan Allah ketika meyakini beberapa tuhan atau mengarahkan ibadah kepada selain Allah.'),
    soal('Apa gambaran ringkas tentang Khawarij dalam materi?', ['kelompok yang mengembangkan armada laut', 'kelompok yang di antaranya mengafirkan pelaku dosa besar', 'kelompok yang menetapkan kalender Hijriah', 'kelompok yang hanya membahas nama-nama Allah'], 1, 'Sebagian kelompok Khawarij dikenal dalam sejarah teologi karena mengafirkan pelaku dosa besar.'),
    soal('Mengapa gambaran ringkas sebuah kelompok tidak boleh dianggap mewakili semua anggotanya di setiap masa?', ['karena sejarah tidak pernah berubah', 'karena tidak ada sumber tertulis', 'karena kelompok memiliki cabang, perkembangan, dan variasi pemikiran', 'karena semua kelompok identik'], 2, 'Materi menekankan adanya cabang dan variasi pemikiran dalam kelompok-kelompok historis.'),
    soal('Persoalan yang sering dikaitkan dengan Mu’tazilah dalam materi mencakup ....', ['sifat Allah, iman, dan takdir', 'perdagangan rempah saja', 'sistem penanggalan saja', 'teknik membangun rumah saja'], 0, 'Ringkasan mengaitkan Mu’tazilah dengan pembahasan sifat Allah, posisi pelaku dosa besar, dan tanggung jawab manusia.'),
    soal('Pasangan kelompok dan persoalan yang paling sesuai adalah ....', ['Jabariyah — standardisasi mushaf', 'Khawarij — armada laut', 'Jahmiyah — kalender Hijriah', 'Qadariyah — takdir dan tanggung jawab manusia'], 3, 'Qadariyah dibahas dalam kaitannya dengan kebebasan dan tanggung jawab manusia dalam persoalan takdir.'),
    soal('Apakah semua pengikut Asy’ariyah dan Maturidiyah tepat disebut menyerupakan Allah dengan makhluk?', ['Ya, tanpa pengecualian', 'Tidak; materi secara jelas menyatakan penyamaan itu tidak tepat', 'Ya, karena semua mazhab sama', 'Tidak perlu mempelajari pandangannya'], 1, 'Materi menegaskan bahwa tidak tepat menyamakan seluruh pengikut Asy’ariyah dan Maturidiyah dengan kelompok yang menyerupakan Allah dengan makhluk.'),
    soal('Kekeliruan metode saat mempelajari kelompok-kelompok akidah adalah ....', ['memeriksa sumber dan konteks', 'mengenali perbedaan definisi', 'menggeneralisasi semua anggota berdasarkan satu gambaran sederhana', 'memahami perkembangan sejarah'], 2, 'Kajian yang teliti menghindari generalisasi dan memperhatikan sejarah serta variasi pemikiran.'),
    soal('Dalam materi, ateisme terutama dikaitkan dengan pertentangan terhadap keyakinan tentang ....', ['Allah sebagai Pencipta', 'keutamaan belajar', 'kewajiban menjaga kebersihan', 'pentingnya ilmu bahasa'], 0, 'Ateisme dalam bentuk yang dijelaskan menolak keberadaan Tuhan dan pencipta ilahi.'),
    soal('Manakah pasangan yang benar?', ['Murji’ah — mengembangkan taktik parit', 'Musyabbihah — penetapan kalender Hijriah', 'Khawarij — standar penulisan mushaf', 'Jahmiyah — sering dikaitkan dengan penolakan sifat Allah'], 3, 'Ringkasan materi mengaitkan Jahmiyah dengan penolakan sifat Allah dalam sumber teologi klasik.'),
    soal('Perbedaan pandangan tentang pelaku dosa besar yang disebut dalam materi melibatkan ....', ['hanya para ahli matematika', 'Khawarij, Murji’ah, dan Mu’tazilah dengan rumusan berbeda', 'hanya sejarawan modern', 'tidak ada kelompok teologi'], 1, 'Materi membandingkan pandangan Khawarij, Murji’ah, dan Mu’tazilah tentang iman dan pelaku dosa besar.'),
    soal('Apa cara terbaik mempelajari istilah polemis dalam sejarah akidah?', ['mengulang tuduhan tanpa membaca sumber', 'menganggap semua istilah memiliki makna sama', 'menelaah konteks, sumber, dan keragaman pandangan', 'memakai istilah untuk mencela orang lain'], 2, 'Materi menyarankan ketelitian sejarah dan penghindaran tuduhan tanpa dasar.'),

    // Penerapan dan Pengulangan
    soal('Cara mudah mengingat tauhid rububiyah dalam materi adalah bertanya ....', ['siapa yang menciptakan dan mengatur?', 'siapa yang paling kaya?', 'bagaimana cara berdagang?', 'kapan musim hujan?'], 0, 'Rububiyah dapat diingat melalui pertanyaan tentang siapa yang menciptakan dan mengatur alam.'),
    soal('Cara mudah mengingat tauhid uluhiyah adalah bertanya ....', ['siapa yang mengatur kalender?', 'kepada siapa ibadah ditujukan?', 'apa warna langit?', 'berapa jumlah penduduk?'], 1, 'Uluhiyah dapat diingat melalui pertanyaan: kepada siapa ibadah ditujukan?'),
    soal('Cara mudah mengingat tauhid asma wa sifat adalah ....', ['menyamakan Allah dengan manusia', 'menolak seluruh nama Allah', 'mengenal nama dan sifat Allah melalui wahyu tanpa menyerupakan-Nya dengan makhluk', 'menganggap makhluk memiliki sifat ketuhanan'], 2, 'Asma wa sifat berkaitan dengan nama dan sifat Allah berdasarkan wahyu serta tidak menyerupakan-Nya dengan makhluk.'),
    soal('Seorang murid berusaha mempersiapkan ujian, berdoa, lalu menerima hasil dengan bersandar kepada Allah. Sikap ini mencerminkan ....', ['syirik khafi secara pasti', 'kufur nikmat', 'penolakan iman', 'tawakal yang disertai ikhtiar'], 3, 'Tawakal yang benar dilakukan setelah usaha yang tepat dan disertai penyerahan hasil kepada Allah.'),
    soal('Seseorang sengaja memperlihatkan ibadah agar mendapat sanjungan. Istilah yang berkaitan dengan perilaku ini adalah ....', ['riya', 'hijrah', 'syura', 'ikhtiar'], 0, 'Riya adalah melakukan ibadah untuk mendapatkan pujian atau penilaian manusia.'),
    soal('Seorang teman melakukan dosa. Berdasarkan materi, sikap yang tepat adalah ....', ['langsung menyatakan ia keluar dari Islam', 'tidak otomatis mengafirkan; penilaian hukum memerlukan ilmu dan kehati-hatian', 'menyebarkan tuduhan', 'menganggap syahadat tidak berguna'], 1, 'Materi memperingatkan bahwa dosa tidak otomatis mengeluarkan seseorang dari Islam dan penilaian individu membutuhkan kehati-hatian.'),
    soal('Pokok utama syahadat pertama adalah ....', ['mengakui banyak tuhan', 'menolak ibadah', 'kesaksian bahwa hanya Allah yang berhak diibadahi', 'mengakui semua makhluk sebagai pencipta'], 2, 'Syahadat pertama menegaskan bahwa tidak ada sesembahan yang berhak diibadahi selain Allah.'),
    soal('Kesimpulan paling menyeluruh dari ringkasan akidah ini adalah ....', ['perbedaan pendapat membolehkan tuduhan tanpa bukti', 'setiap dosa pasti kufur akbar', 'usaha manusia tidak diperlukan sama sekali', 'tauhid menjadi dasar, iman berkaitan dengan keyakinan dan pengamalan, dan penilaian terhadap individu memerlukan kehati-hatian'], 3, 'Materi merangkum tauhid sebagai dasar, iman sebagai keyakinan yang tercermin dalam ucapan dan amal, tawakal yang disertai usaha, serta kehati-hatian dalam menilai orang.'),
  ],
};

// Beri ID unik otomatis bila belum ada.
Object.keys(BANK_SOAL).forEach(k => BANK_SOAL[k].forEach((s, i) => {
  if (!s.id) s.id = `${k}-${String(i + 1).padStart(2, '0')}`;
}));

/* ---------- 3. STATE ---------- */
const state = {
  page: 1, subject: null, level: null,
  questions: [], index: 0,
  score: 0, correct: 0, wrong: 0, timeout: 0,
  locked: true, finished: false,
  timerId: null, deadline: 0, startedAt: 0,
  navTimer: null,
};

/* ---------- 4. UTILITAS ---------- */
const $ = id => document.getElementById(id);
const optionButtons = () => Array.from(document.querySelectorAll('#options .opt'));

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

// Fisher–Yates: mengembalikan salinan yang teracak (array asli tidak berubah).
function acak(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function restartAnimation(node, cls) {
  node.classList.remove(cls);
  void node.offsetWidth; // paksa reflow agar animasi bisa diputar ulang
  node.classList.add(cls);
}

/* ---------- 5. NAVIGASI ---------- */
function showPage(n) {
  if (n !== 3) stopTimer(); // timer tidak boleh jalan di luar Page 3
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page' + n));
  state.page = n;
  window.scrollTo(0, 0);
  if (n < 3) $('title' + n).focus({ preventScroll: true });
}

// Jeda singkat untuk animasi pemilihan; dapat dibatalkan agar tidak ada navigasi ganda.
function navigateAfter(ms, fn) {
  cancelNav();
  state.navTimer = setTimeout(() => { state.navTimer = null; fn(); }, ms);
}
function cancelNav() {
  if (state.navTimer !== null) { clearTimeout(state.navTimer); state.navTimer = null; }
}

function clearSelected(containerId) {
  document.querySelectorAll(`#${containerId} .card`).forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
  });
}
function markSelected(btn) {
  btn.classList.add('selected');
  btn.setAttribute('aria-pressed', 'true');
}

function buildSubjects() {
  const grid = $('subjectGrid');
  MAPEL.forEach(m => {
    const btn = el('button', 'card');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.append(el('span', 'icon', m.ikon), el('strong', 'name', m.nama), el('span', 'desc', m.desk));
    btn.querySelector('.icon').setAttribute('aria-hidden', 'true');
    btn.addEventListener('click', () => selectSubject(m, btn));
    grid.appendChild(btn);
  });
}

function buildLevels() {
  const grid = $('levelGrid');
  for (let n = 1; n <= JUMLAH_LEVEL; n++) {
    const btn = el('button', 'card lvl');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', `Level ${n}`);
    btn.append(el('span', 'num', String(n)), el('span', 'lbl', `LEVEL ${n}`));
    btn.addEventListener('click', () => selectLevel(n, btn));
    grid.appendChild(btn);
  }
}

function selectSubject(m, btn) {
  clearSelected('subjectGrid');
  markSelected(btn);
  state.subject = m;
  navigateAfter(450, () => {
    $('subjectInfo').textContent = `Mata Pelajaran: ${m.nama}`;
    clearSelected('levelGrid');
    $('levelError').hidden = true;
    showPage(2);
  });
}

function selectLevel(n, btn) {
  clearSelected('levelGrid');
  markSelected(btn);
  state.level = n;
  navigateAfter(350, startLevel);
}

/* ---------- 6. SOAL ---------- */
// Validasi bank soal. Mengembalikan pesan error, atau '' jika bank valid.
function validasiBank(subjectId) {
  const bank = BANK_SOAL[subjectId];
  const nama = (MAPEL.find(m => m.id === subjectId) || {}).nama || subjectId;
  if (!Array.isArray(bank) || bank.length < JUMLAH_SOAL) {
    return `Bank soal ${nama} baru berisi ${bank ? bank.length : 0} soal. Dibutuhkan minimal ${JUMLAH_SOAL} soal agar level dapat dimulai.`;
  }
  const ids = new Set();
  for (const s of bank) {
    if (!s.id || ids.has(s.id)) return `Bank soal ${nama}: ID soal kosong atau duplikat (${s.id || '—'}).`;
    ids.add(s.id);
    if (!s.question || !Array.isArray(s.options) || s.options.length !== 4 || new Set(s.options).size !== 4) {
      return `Bank soal ${nama}: soal ${s.id} harus punya pertanyaan dan tepat 4 pilihan yang berbeda.`;
    }
    if (!Number.isInteger(s.correctAnswer) || s.correctAnswer < 0 || s.correctAnswer > 3) {
      return `Bank soal ${nama}: kunci jawaban soal ${s.id} tidak valid.`;
    }
  }
  return '';
}

// Pilih 10 soal unik secara acak; pilihan diacak sebagai pasangan {id, text}
// sehingga kunci jawaban (correctId) tetap benar setelah diacak.
function siapkanSoal(subjectId) {
  return acak(BANK_SOAL[subjectId]).slice(0, JUMLAH_SOAL).map(s => ({
    id: s.id,
    question: s.question,
    explanation: s.explanation || '',
    options: acak(s.options.map((text, i) => ({ id: i, text }))),
    correctId: s.correctAnswer,
  }));
}

function startLevel() {
  const err = validasiBank(state.subject.id);
  const errBox = $('levelError');
  if (err) { errBox.textContent = err; errBox.hidden = false; return; }
  errBox.hidden = true;

  stopTimer();
  Object.assign(state, {
    questions: siapkanSoal(state.subject.id), index: 0,
    score: 0, correct: 0, wrong: 0, timeout: 0,
    locked: true, finished: false, startedAt: Date.now(),
  });
  $('gSubject').textContent = `Mata Pelajaran: ${state.subject.nama}`;
  $('gLevel').textContent = `LEVEL ${state.level}`;
  $('gScore').textContent = '0';
  $('gameArea').hidden = false;
  $('resultArea').hidden = true;
  showPage(3);
  showQuestion();
}

function showQuestion() {
  const q = state.questions[state.index];
  const last = state.index === JUMLAH_SOAL - 1;
  state.locked = false;

  $('gCounter').textContent = `PERTANYAAN ${state.index + 1} / ${JUMLAH_SOAL}`;
  $('qLabel').textContent = `SOAL #${state.index + 1}`;
  $('qText').textContent = q.question;
  $('qPanel').classList.remove('timeup');
  setProgress(state.index);

  optionButtons().forEach((btn, i) => {
    btn.className = 'opt';
    btn.disabled = false;
    btn.querySelector('.txt').textContent = q.options[i].text;
    btn.querySelector('.mark').textContent = '';
  });

  showFeedback('', '');
  $('explain').textContent = '';
  $('nextBtn').disabled = true;
  $('nextBtn').textContent = last ? 'SELESAI LEVEL' : 'NEXT';
  startTimer();
}

function setProgress(done) {
  $('progressFill').style.width = `${(done / JUMLAH_SOAL) * 100}%`;
  $('progressBar').setAttribute('aria-valuenow', String(done));
}

function showFeedback(type, text) {
  const box = $('feedback');
  box.className = 'feedback' + (type ? ' ' + type : '');
  box.textContent = text;
}

/* ---------- 7. TIMER ---------- */
function stopTimer() {
  if (state.timerId !== null) { clearInterval(state.timerId); state.timerId = null; }
}

function startTimer() {
  stopTimer(); // pastikan tidak pernah ada dua interval sekaligus
  state.deadline = Date.now() + WAKTU_MS;
  renderTimer(WAKTU_MS);
  state.timerId = setInterval(() => {
    const left = state.deadline - Date.now(); // berbasis waktu nyata, bebas drift
    if (left <= 0) { renderTimer(0); handleTimeout(); }
    else renderTimer(left);
  }, 100);
}

function renderTimer(ms) {
  const sec = Math.ceil(ms / 1000);
  $('timerNum').textContent = String(sec);
  $('timerFill').style.width = `${(ms / WAKTU_MS) * 100}%`;
  $('timerBox').className = 'timer' + (sec <= 2 ? ' danger' : sec <= 5 ? ' warn' : '');
}

/* ---------- 8. JAWABAN & SKOR ---------- */
// Mengunci soal: hanya satu kali bisa lolos (jawaban, klik ganda, atau timer).
function lockQuestion() {
  if (state.locked) return false;
  state.locked = true;
  stopTimer();
  optionButtons().forEach(b => { b.disabled = true; });
  return true;
}

function markOption(btn, cls, symbol) {
  btn.classList.add(cls);
  btn.querySelector('.mark').textContent = symbol;
}

function applyScore(delta) {
  state.score += delta; // boleh negatif
  $('gScore').textContent = String(state.score);
  const pop = $('scorePop');
  pop.textContent = delta > 0 ? `+${delta}` : String(delta);
  pop.className = 'score-pop ' + (delta > 0 ? 'plus' : 'minus');
  restartAnimation(pop, 'show');
}

function finishQuestion(q) {
  $('explain').textContent = q.explanation ? `Penjelasan: ${q.explanation}` : '';
  setProgress(state.index + 1);
  $('nextBtn').disabled = false; // NEXT aktif; tidak ada perpindahan otomatis
}

function handleAnswer(pos) {
  if (!lockQuestion()) return;
  const q = state.questions[state.index];
  const btns = optionButtons();
  const correctPos = q.options.findIndex(o => o.id === q.correctId);

  if (q.options[pos].id === q.correctId) {
    state.correct++;
    markOption(btns[pos], 'correct', '✓');
    applyScore(POIN_BENAR);
    showFeedback('ok', '✓ JAWABAN BENAR! +5 POIN');
  } else {
    state.wrong++;
    markOption(btns[pos], 'wrong', '✗');
    markOption(btns[correctPos], 'correct', '✓');
    applyScore(POIN_SALAH);
    showFeedback('bad', '✗ JAWABAN SALAH! -2 POIN');
  }
  finishQuestion(q);
}

function handleTimeout() {
  if (!lockQuestion()) return;
  const q = state.questions[state.index];
  const correctPos = q.options.findIndex(o => o.id === q.correctId);
  state.timeout++;
  markOption(optionButtons()[correctPos], 'correct', '✓');
  restartAnimation($('qPanel'), 'timeup');
  applyScore(POIN_WAKTU_HABIS);
  showFeedback('time', '⏱ WAKTU HABIS! -2 POIN');
  finishQuestion(q);
}

function nextQuestion() {
  if (!state.locked || state.finished || $('nextBtn').disabled) return;
  if (state.index >= JUMLAH_SOAL - 1) { showResult(); return; }
  state.index++;
  showQuestion();
  optionButtons()[0].focus({ preventScroll: true });
}

/* ---------- 9. HASIL ---------- */
function formatDurasi(detik) {
  return detik >= 60 ? `${Math.floor(detik / 60)} mnt ${detik % 60} dtk` : `${detik} dtk`;
}

function pesanHasil(p) {
  if (p >= 80) return 'Luar biasa! Kamu siap naik level.';
  if (p >= 50) return 'Bagus! Sedikit lagi menuju sempurna.';
  return 'Jangan menyerah. Coba lagi dan kamu pasti naik level!';
}

function showResult() {
  stopTimer();
  state.finished = true;
  const persen = (state.correct / JUMLAH_SOAL) * 100;
  const detik = Math.round((Date.now() - state.startedAt) / 1000);

  $('gCounter').textContent = 'LEVEL SELESAI';
  $('gameArea').hidden = true;
  $('resultArea').hidden = false;
  $('rMsg').textContent = pesanHasil(persen);
  $('rScore').textContent = String(state.score);
  $('rSubject').textContent = state.subject.nama;
  $('rLevel').textContent = `Level ${state.level}`;
  $('rCorrect').textContent = String(state.correct);
  $('rWrong').textContent = String(state.wrong);
  $('rTimeout').textContent = String(state.timeout);
  $('rTime').textContent = formatDurasi(detik);
  $('rPercent').textContent = `${persen}%`;
  $('rBar').style.width = '0';
  requestAnimationFrame(() => { $('rBar').style.width = `${persen}%`; });
  restartAnimation($('rScore'), 'pop-in');
  $('resultTitle').focus({ preventScroll: true });
}

function leaveGame() {
  cancelNav();
  stopTimer();
  state.locked = true;
  clearSelected('levelGrid');
  showPage(2);
}

/* ---------- 10. INIT ---------- */
function init() {
  buildSubjects();
  buildLevels();

  // Satu listener (delegasi) untuk semua pilihan jawaban.
  $('options').addEventListener('click', e => {
    const btn = e.target.closest('.opt');
    if (btn) handleAnswer(Number(btn.dataset.i));
  });
  $('nextBtn').addEventListener('click', nextQuestion);
  $('backToSubjects').addEventListener('click', () => { cancelNav(); clearSelected('subjectGrid'); showPage(1); });
  $('backToLevels').addEventListener('click', leaveGame);
  $('toLevelsBtn').addEventListener('click', leaveGame);
  $('againBtn').addEventListener('click', startLevel);

  // Pintasan keyboard: A–D atau 1–4 untuk memilih jawaban.
  document.addEventListener('keydown', e => {
    if (state.page !== 3 || state.finished || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const pos = 'abcd1234'.indexOf(e.key.toLowerCase()) % 4;
    if (pos >= 0) handleAnswer(pos);
  });

  showPage(1);
}

if (typeof document !== 'undefined') init();
