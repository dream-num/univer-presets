import type { IUniverConfig } from '@univerjs/core';
import type { IPreset } from '../../../type';
import { UniverSheetsPivotTablePlugin } from '@univerjs-pro/sheets-pivot';

export function UniverSheetsAdvancedWorkerPreset(config: { locales: IUniverConfig['locales'] }): IPreset {
    return {
        locales: config.locales,
        plugins: [
            [UniverSheetsPivotTablePlugin, { notExecuteFormula: false }],
        ],
    };
}
