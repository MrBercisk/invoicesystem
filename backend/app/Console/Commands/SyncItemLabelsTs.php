<?php

namespace App\Console\Commands;

use App\Support\ItemLabels;
use Illuminate\Console\Command;

/**
 * Generate resources/js/lib/itemLabels.generated.ts dari App\Support\ItemLabels
 * supaya PHP tetap jadi satu-satunya sumber kebenaran dan tidak perlu sync
 * manual dua tempat. Jalankan setiap kali ItemLabels::$labels diubah:
 *
 *   php artisan item-labels:sync-ts
 *
 * Pertimbangkan tambahkan ke composer.json "post-autoload-dump" atau CI step
 * supaya otomatis jalan sebelum build frontend.
 */
class SyncItemLabelsTs extends Command
{
    protected $signature = 'item-labels:sync-ts';

    protected $description = 'Generate itemLabels.generated.ts dari App\Support\ItemLabels (PHP = source of truth)';

    public function handle(): int
    {
        $labels = ItemLabels::all();
        $json = json_encode($labels, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        // Indent JSON supaya konsisten dengan gaya 2-space di TS
        $json = str_replace('    ', '  ', $json);

        $defaultType = ItemLabels::DEFAULT_TYPE;

        $ts = <<<TS
        // ============================================================
        // FILE INI DI-GENERATE OTOMATIS. JANGAN EDIT MANUAL.
        // Sumber: App\\Support\\ItemLabels.php
        // Generate ulang dengan: php artisan item-labels:sync-ts
        // ============================================================

        import type { HandoverItemType } from './';

        export const DEFAULT_BUSINESS_TYPE = '{$defaultType}';

        export interface ItemLabelSet {
        section: string;
        name_column: string;
        condition_label: string | null;
        }

        export type ItemLabelsDict = Record<string, Record<HandoverItemType, ItemLabelSet>>;

        export const ITEM_LABELS: ItemLabelsDict = {$json} as const;

        export function forType(businessType: string | null | undefined, itemType: HandoverItemType): ItemLabelSet {
        const group = (businessType && ITEM_LABELS[businessType]) || ITEM_LABELS[DEFAULT_BUSINESS_TYPE];
        return group[itemType] ?? ITEM_LABELS[DEFAULT_BUSINESS_TYPE][itemType];
        }

        export function section(businessType: string | null | undefined, itemType: HandoverItemType): string {
        return forType(businessType, itemType).section;
        }

        export function nameColumn(businessType: string | null | undefined, itemType: HandoverItemType): string {
        return forType(businessType, itemType).name_column;
        }

        export function conditionLabel(businessType: string | null | undefined, itemType: HandoverItemType): string | null {
        return forType(businessType, itemType).condition_label;
        }

        export function hasCondition(businessType: string | null | undefined, itemType: HandoverItemType): boolean {
        return conditionLabel(businessType, itemType) !== null;
        }

        export function availableBusinessTypes(): string[] {
        return Object.keys(ITEM_LABELS);
        }
        TS;

        $path = base_path('frontend/src/types/itemLabels.generated.ts');

        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        file_put_contents($path, $ts);

        $this->info("Generated: {$path}");

        return self::SUCCESS;
    }
}