<?php

namespace App\Support;

/**
 * Kamus label untuk item dokumen serah terima, dikelompokkan per
 * business_type milik Company, lalu per tipe item (TYPE_BARANG | TYPE_PEKERJAAN).
 *
 * PENTING: nilai `type` yang tersimpan di database (barang/pekerjaan) TIDAK
 * pernah berubah — yang berubah cuma teks yang ditampilkan ke user. Ini
 * sengaja dipisah supaya menambah bisnis baru = tambah satu entry di sini,
 * lalu jalankan `php artisan item-labels:sync-ts` untuk generate ulang
 * src/lib/itemLabels.generated.ts. JANGAN edit file .generated.ts manual.
 */
class ItemLabels
{
    public const DEFAULT_TYPE = 'general';

    public const TYPE_BARANG = 'barang';
    public const TYPE_PEKERJAAN = 'pekerjaan';

    protected static array $labels = [
        'general' => [
            self::TYPE_BARANG => [
                'section'         => 'Daftar Barang',
                'name_column'     => 'Nama Barang',
                'condition_label' => 'Kondisi',
            ],
            self::TYPE_PEKERJAAN => [
                'section'         => 'Daftar Pekerjaan',
                'name_column'     => 'Nama Pekerjaan',
                'condition_label' => null,
            ],
        ],

        'web_dev' => [
            self::TYPE_BARANG => [
                'section'         => 'Daftar Aset/Akses',
                'name_column'     => 'Nama Aset/Akses',
                'condition_label' => 'Status',
            ],
            self::TYPE_PEKERJAAN => [
                'section'         => 'Daftar Fitur',
                'name_column'     => 'Nama Fitur',
                'condition_label' => null,
            ],
        ],

        'kue' => [
            self::TYPE_BARANG => [
                'section'         => 'Daftar Produk',
                'name_column'     => 'Nama Produk',
                'condition_label' => 'Kondisi',
            ],
            self::TYPE_PEKERJAAN => [
                'section'         => 'Daftar Jasa',
                'name_column'     => 'Nama Jasa',
                'condition_label' => null,
            ],
        ],
    ];

    /**
     * @param string|null $businessType Nilai dari $company->business_type
     * @param string      $itemType     self::TYPE_BARANG atau self::TYPE_PEKERJAAN
     */
    public static function forType(?string $businessType, string $itemType): array
    {
        $group = static::$labels[$businessType] ?? static::$labels[self::DEFAULT_TYPE];

        return $group[$itemType] ?? static::$labels[self::DEFAULT_TYPE][$itemType];
    }

    public static function section(?string $businessType, string $itemType): string
    {
        return static::forType($businessType, $itemType)['section'];
    }

    public static function nameColumn(?string $businessType, string $itemType): string
    {
        return static::forType($businessType, $itemType)['name_column'];
    }

    public static function conditionLabel(?string $businessType, string $itemType): ?string
    {
        return static::forType($businessType, $itemType)['condition_label'];
    }

    /**
     * has_condition diturunkan dari condition_label, bukan field terpisah,
     * supaya tidak mungkin ada state kontradiktif (has_condition true tapi
     * label-nya null).
     */
    public static function hasCondition(?string $businessType, string $itemType): bool
    {
        return static::conditionLabel($businessType, $itemType) !== null;
    }

    /**
     * Daftar business_type yang valid. Dipakai untuk dropdown form company
     * dan validasi (Rule::in(ItemLabels::available())).
     */
    public static function available(): array
    {
        return array_keys(static::$labels);
    }

    /**
     * Daftar item type yang valid.
     */
    public static function availableItemTypes(): array
    {
        return [self::TYPE_BARANG, self::TYPE_PEKERJAAN];
    }

    /**
     * Seluruh kamus label. Dipakai oleh command sync-ts untuk generate
     * src/lib/itemLabels.generated.ts — jangan panggil ini di controller/view,
     * pakai method spesifik (section/nameColumn/hasCondition/conditionLabel).
     */
    public static function all(): array
    {
        return static::$labels;
    }
}