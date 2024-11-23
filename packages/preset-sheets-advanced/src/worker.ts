import type { IPreset } from './types';
import { UniverSheetsPivotTablePlugin } from '@univerjs-pro/sheets-pivot';

export function UniverSheetsAdvancedWorkerPreset(): IPreset {
    return {
        plugins: [
            [UniverSheetsPivotTablePlugin, { notExecuteFormula: false }],
        ],
    };
}
