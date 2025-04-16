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

import '@univerjs/sheets/lib/facade';
import '@univerjs/sheets-formula/lib/facade';
import '@univerjs/sheets-data-validation/lib/facade';
import '@univerjs/engine-formula/lib/facade';
import '@univerjs/sheets-filter/lib/facade';
import '@univerjs/sheets-hyper-link/lib/facade';
import '@univerjs/sheets-numfmt/lib/facade';
import '@univerjs/sheets-sort/lib/facade';
import '@univerjs/sheets-thread-comment/lib/facade';

export type * from '@univerjs/engine-formula/lib/facade';
export type * from '@univerjs/sheets-data-validation/lib/facade';
export type * from '@univerjs/sheets-filter/lib/facade';
export type * from '@univerjs/sheets-formula/lib/facade';
export type * from '@univerjs/sheets-hyper-link/lib/facade';
export type * from '@univerjs/sheets-numfmt/lib/facade';
export type * from '@univerjs/sheets-sort/lib/facade';
export type * from '@univerjs/sheets-thread-comment/lib/facade';
export type * from '@univerjs/sheets/lib/facade';

export interface IUniverSheetsNodeCorePresetConfig {
    /**
     * The formula configuration.
     */
    formula?: IUniverFormulaConfig;

    /**
     * The URL of the worker script.
     */
    workerSrc?: string;
}

export function UniverSheetsNodeCorePreset(config: Partial<IUniverSheetsNodeCorePresetConfig> = {}): IPreset {
    const { workerSrc, formula } = config;

    const useWorker = !!workerSrc;

    return {
        plugins: [
            useWorker
                ? [UniverRPCNodeMainPlugin, { workerSrc }]
                : null,
            [UniverFormulaEnginePlugin, {
                notExecuteFormula: useWorker,
                function: formula?.function,
            }],

            UniverThreadCommentPlugin,
            UniverDocsPlugin,

            UniverSheetsPlugin,
            [UniverSheetsFormulaPlugin, {
                notExecuteFormula: useWorker,
                description: formula?.description,
                initialFormulaComputing: formula?.initialFormulaComputing,
            }],
            UniverSheetsDataValidationPlugin,
            UniverSheetsFilterPlugin,
            UniverSheetsHyperLinkPlugin,
            UniverSheetsDrawingPlugin,
            UniverSheetsSortPlugin,
            UniverSheetsThreadCommentPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
}
