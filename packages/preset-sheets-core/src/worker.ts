import type { IUniverEngineFormulaConfig } from '@univerjs/engine-formula';
import type { IPreset } from './types';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCWorkerThreadPlugin } from '@univerjs/rpc';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverRemoteSheetsFormulaPlugin } from '@univerjs/sheets-formula';

export interface IUniverSheetsCoreWorkerPresetConfig extends
    Pick<IUniverEngineFormulaConfig, 'function'> {}

export function UniverSheetsCoreWorkerPreset(config: Partial<IUniverSheetsCoreWorkerPresetConfig> = {}): IPreset {
    const {
        function: functionUser,
    } = config;
    return {
        plugins: [
            [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
            [UniverFormulaEnginePlugin, { function: functionUser }],
            UniverRPCWorkerThreadPlugin,
            UniverRemoteSheetsFormulaPlugin,
        ],
    };
}
