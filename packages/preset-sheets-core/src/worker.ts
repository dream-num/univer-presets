import type { IPreset } from './types';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCWorkerThreadPlugin } from '@univerjs/rpc';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverRemoteSheetsFormulaPlugin } from '@univerjs/sheets-formula';

export * from '@univerjs/engine-formula';
export * from '@univerjs/rpc';
export * from '@univerjs/sheets';
export * from '@univerjs/sheets-formula';

export function UniverSheetsCoreWorkerPreset(): IPreset {
    return {
        plugins: [
            [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
            UniverFormulaEnginePlugin,
            UniverRPCWorkerThreadPlugin,
            UniverRemoteSheetsFormulaPlugin,
        ],
    };
}
