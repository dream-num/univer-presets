import type { IPreset, IUniverFormulaConfig } from './types';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCNodeMainPlugin } from '@univerjs/rpc-node';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsDrawingPlugin } from '@univerjs/sheets-drawing';
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsHyperLinkPlugin } from '@univerjs/sheets-hyper-link';
import { UniverSheetsSortPlugin } from '@univerjs/sheets-sort';
import { UniverSheetsThreadCommentPlugin } from '@univerjs/sheets-thread-comment';
import { UniverThreadCommentPlugin } from '@univerjs/thread-comment';

import '@univerjs/sheets/facade';
import '@univerjs/sheets-formula/facade';
import '@univerjs/sheets-data-validation/facade';
import '@univerjs/engine-formula/facade';
import '@univerjs/sheets-filter/facade';

export interface IUniverSheetsNodeCorePresetConfig {
    formula?: IUniverFormulaConfig;
    workerSrc?: string;
}

export function UniverSheetsNodeCorePreset(config: Partial<IUniverSheetsNodeCorePresetConfig>): IPreset {
    const { workerSrc, formula } = config;

    const useWorker = !!workerSrc;

    return {
        plugins: [
            useWorker
                ? [UniverRPCNodeMainPlugin, { workerSrc }]
                : null,
            [UniverFormulaEnginePlugin, { notExecuteFormula: useWorker, function: formula?.function }],

            UniverThreadCommentPlugin,
            UniverDocsPlugin,

            UniverSheetsPlugin,
            [UniverSheetsFormulaPlugin, { notExecuteFormula: useWorker, description: formula?.description }],
            UniverSheetsDataValidationPlugin,
            UniverSheetsFilterPlugin,
            UniverSheetsHyperLinkPlugin,
            UniverSheetsDrawingPlugin,
            UniverSheetsSortPlugin,
            UniverSheetsThreadCommentPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
}
