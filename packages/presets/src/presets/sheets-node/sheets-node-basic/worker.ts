import type { IUniverConfig } from '@univerjs/core';
import type { IPreset } from '../../../type';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCNodeWorkerPlugin } from '@univerjs/rpc-node';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverRemoteSheetsFormulaPlugin } from '@univerjs/sheets-formula';

export function UniverSheetsBasicWorkerPreset(config: { locales: IUniverConfig['locales'] }): IPreset {
    return {
        locales: config.locales,
        plugins: [
            [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
            UniverFormulaEnginePlugin,
            UniverRPCNodeWorkerPlugin,
            UniverRemoteSheetsFormulaPlugin,
        ],
    };
}
