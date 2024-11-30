import type { IPreset } from './types';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCNodeWorkerPlugin } from '@univerjs/rpc-node';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverRemoteSheetsFormulaPlugin } from '@univerjs/sheets-formula';

export * from '@univerjs/engine-formula';
export * from '@univerjs/rpc-node';
export * from '@univerjs/sheets';
export * from '@univerjs/sheets-formula';

export function UniverSheetsNodeCoreWorkerPreset(): IPreset {
    return {
        plugins: [
            [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
            UniverFormulaEnginePlugin,
            UniverRPCNodeWorkerPlugin,
            UniverRemoteSheetsFormulaPlugin,
        ],
    };
}
