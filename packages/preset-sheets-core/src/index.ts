import type { IUniverRPCMainThreadConfig } from '@univerjs/rpc';
import type { IUniverSheetsUIConfig } from '@univerjs/sheets-ui';
import type { IUniverUIConfig } from '@univerjs/ui';
import type { IPreset } from '../../types';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverRPCMainThreadPlugin } from '@univerjs/rpc';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsFormulaUIPlugin } from '@univerjs/sheets-formula-ui';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverUIPlugin } from '@univerjs/ui';

// NOTE: here we copy code from everything.ts. That file (along with the package itself) would be removed in the future.
import '@univerjs/sheets/facade';
import '@univerjs/ui/facade';
import '@univerjs/docs-ui/facade';
import '@univerjs/sheets-ui/facade';
import '@univerjs/engine-formula/facade';
import '@univerjs/sheets-formula/facade';
import '@univerjs/sheets-numfmt/facade';

export interface IUniverSheetsCorePresetConfig extends
    Pick<IUniverUIConfig, 'container' | 'header' | 'footer' | 'toolbar' | 'menu' | 'contextMenu' | 'disableAutoFocus'>,
    Pick<IUniverSheetsUIConfig, 'formulaBar'> {

    workerURL: IUniverRPCMainThreadConfig['workerURL'];
}

/**
 * This presets helps you to create a Univer sheet with open sourced features.
 */
export function UniverSheetsCorePreset(config: Partial<IUniverSheetsCorePresetConfig> = {}): IPreset {
    const {
        container = 'app',
        workerURL: workerSrc,
    } = config;

    const useWorker = !!workerSrc;

    return {
        plugins: [
            UniverDocsPlugin,
            UniverRenderEnginePlugin,
            [UniverUIPlugin, { container }],
            UniverDocsUIPlugin,

            useWorker
                ? [UniverRPCMainThreadPlugin, { workerURL: workerSrc }]
                : null,
            [UniverFormulaEnginePlugin, { notExecuteFormula: useWorker }],

            [UniverSheetsPlugin, { notExecuteFormula: useWorker, onlyRegisterFormulaRelatedMutations: false }],
            UniverSheetsUIPlugin,
            UniverSheetsNumfmtPlugin,

            UniverSheetsFormulaPlugin,
            UniverSheetsFormulaUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};