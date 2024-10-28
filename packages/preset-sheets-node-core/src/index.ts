import type { IPreset } from '../../types';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCNodeMainPlugin } from '@univerjs/rpc-node';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';

import '@univerjs/sheets/facade';
import '@univerjs/engine-formula/facade';
import '@univerjs/sheets-formula/facade';

export interface IUniverSheetsNodeCorePresetConfig {

    workerSrc?: string;
}

export function UniverSheetsNodeCorePreset(config: Partial<IUniverSheetsNodeCorePresetConfig>): IPreset {
    const { workerSrc } = config;

    const useWorker = !!workerSrc;

    return {
        plugins: [
            useWorker
                ? [UniverRPCNodeMainPlugin, { workerSrc }]
                : null,
            [UniverFormulaEnginePlugin, { notExecuteFormula: useWorker }],

            UniverDocsPlugin,

            UniverSheetsPlugin,
            [UniverSheetsFormulaPlugin, { notExecuteFormula: useWorker }],
        ].filter(v => !!v) as IPreset['plugins'],
    };
}
