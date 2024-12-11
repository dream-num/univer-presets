import type { IUniverEngineFormulaConfig } from '@univerjs/engine-formula';
import type { IPreset } from './types';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCNodeWorkerPlugin } from '@univerjs/rpc-node';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverRemoteSheetsFormulaPlugin } from '@univerjs/sheets-formula';

export * from '@univerjs/engine-formula';
export * from '@univerjs/rpc-node';
export * from '@univerjs/sheets';
export * from '@univerjs/sheets-formula';

export interface IUniverSheetsNodeCoreWorkerPresetConfig extends
    Pick<IUniverEngineFormulaConfig, 'function'> {}

export function UniverSheetsNodeCoreWorkerPreset(config: Partial<IUniverSheetsNodeCoreWorkerPresetConfig> = {}): IPreset {
    const {
        function: functionUser,
    } = config;

    return {
        plugins: [
            [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
            [UniverFormulaEnginePlugin, { function: functionUser }],
            UniverRPCNodeWorkerPlugin,
            UniverRemoteSheetsFormulaPlugin,
        ],
    };
}
