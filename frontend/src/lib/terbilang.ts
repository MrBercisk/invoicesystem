/**
 * Konversi angka nominal ke kalimat Terbilang Bahasa Indonesia
 * Contoh: 1250000 -> "Satu Juta Dua Ratus Lima Puluh Ribu Rupiah"
 */

const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

function konversi(nilai: number): string {
  nilai = Math.floor(Math.abs(nilai));
  if (nilai < 12) {
    return satuan[nilai];
  } else if (nilai < 20) {
    return konversi(nilai - 10) + ' Belas';
  } else if (nilai < 100) {
    return konversi(Math.floor(nilai / 10)) + ' Puluh ' + konversi(nilai % 10);
  } else if (nilai < 200) {
    return 'Seratus ' + konversi(nilai - 100);
  } else if (nilai < 1000) {
    return konversi(Math.floor(nilai / 100)) + ' Ratus ' + konversi(nilai % 100);
  } else if (nilai < 2000) {
    return 'Seribu ' + konversi(nilai - 1000);
  } else if (nilai < 1000000) {
    return konversi(Math.floor(nilai / 1000)) + ' Ribu ' + konversi(nilai % 1000);
  } else if (nilai < 1000000000) {
    return konversi(Math.floor(nilai / 1000000)) + ' Juta ' + konversi(nilai % 1000000);
  } else if (nilai < 1000000000000) {
    return konversi(Math.floor(nilai / 1000000000)) + ' Miliar ' + konversi(nilai % 1000000000);
  } else if (nilai < 1000000000000000) {
    return konversi(Math.floor(nilai / 1000000000000)) + ' Triliun ' + konversi(nilai % 1000000000000);
  }
  return '';
}

export function terbilang(nominal: number): string {
  if (nominal === 0) return 'Nol Rupiah';
  const hasil = konversi(nominal).replace(/\s+/g, ' ').trim();
  return `${hasil} Rupiah`;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}
