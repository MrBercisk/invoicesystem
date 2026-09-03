<?php

namespace App\Support;

class Terbilang
{
    private static array $angka = [
        '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
        'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh',
        'Sebelas',
    ];

    public static function make(float $number): string
    {
        $number = (int) round($number);

        if ($number < 0) {
            return 'Minus ' . self::convert(abs($number));
        }

        return self::convert($number) . ' Rupiah';
    }

    private static function convert(int $n): string
    {
        if ($n < 12) {
            return trim(self::$angka[$n]);
        }

        if ($n < 20) {
            return trim(self::convert($n - 10) . ' Belas');
        }

        if ($n < 100) {
            return trim(self::convert(intdiv($n, 10)) . ' Puluh ' . self::convert($n % 10));
        }

        if ($n < 200) {
            return trim('Seratus ' . self::convert($n - 100));
        }

        if ($n < 1000) {
            return trim(self::convert(intdiv($n, 100)) . ' Ratus ' . self::convert($n % 100));
        }

        if ($n < 2000) {
            return trim('Seribu ' . self::convert($n - 1000));
        }

        if ($n < 1000000) {
            return trim(self::convert(intdiv($n, 1000)) . ' Ribu ' . self::convert($n % 1000));
        }

        if ($n < 1000000000) {
            return trim(self::convert(intdiv($n, 1000000)) . ' Juta ' . self::convert($n % 1000000));
        }

        if ($n < 1000000000000) {
            return trim(self::convert(intdiv($n, 1000000000)) . ' Miliar ' . self::convert($n % 1000000000));
        }

        return trim(self::convert(intdiv($n, 1000000000000)) . ' Triliun ' . self::convert($n % 1000000000000));
    }
}