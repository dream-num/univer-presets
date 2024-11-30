import type { IPreset } from './types';
import { UniverProFormulaEnginePlugin } from '@univerjs-pro/engine-formula';
import { UniverLicensePlugin } from '@univerjs-pro/license';
import { UniverSheetsPivotTablePlugin } from '@univerjs-pro/sheets-pivot';

export * from '@univerjs-pro/engine-formula';
export * from '@univerjs-pro/license';
export * from '@univerjs-pro/sheets-pivot';

export interface IUniverSheetsAdvancedWorkerPresetConfig {
    license?: string;
}

export function UniverSheetsAdvancedWorkerPreset(config: Partial<IUniverSheetsAdvancedWorkerPresetConfig> = {
    license: '',
}): IPreset {
    const {
        license,
    } = config;

    return {
        plugins: [
            [UniverLicensePlugin, { license }],
            UniverProFormulaEnginePlugin,
            [UniverSheetsPivotTablePlugin, { notExecuteFormula: false }],
        ],
    };
}
