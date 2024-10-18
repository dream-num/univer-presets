import type { IUniverConfig } from '@univerjs/core';
import type { IPreset } from '../../../type';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCWorkerThreadPlugin } from '@univerjs/rpc';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFilterUIWorkerPlugin } from '@univerjs/sheets-filter-ui';
import { UniverRemoteSheetsFormulaPlugin } from '@univerjs/sheets-formula';

export function UniverSheetsBasicWorkerPreset(config: { locales: IUniverConfig['locales'] }): IPreset {
    return {
        locales: config.locales,
        plugins: [
            [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
            UniverFormulaEnginePlugin,
            UniverRPCWorkerThreadPlugin,
            UniverRemoteSheetsFormulaPlugin,
            UniverSheetsFilterUIWorkerPlugin,
        ],
    };
}
