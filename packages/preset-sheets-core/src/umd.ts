import type { IUniverRPCMainThreadConfig } from '@univerjs/rpc';
import type { IUniverSheetsNumfmtConfig } from '@univerjs/sheets-numfmt';
import type { IUniverSheetsUIConfig } from '@univerjs/sheets-ui';
import type { IUniverUIConfig } from '@univerjs/ui';
import type { IPreset, IUniverFormulaConfig } from './types';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverNetworkPlugin } from '@univerjs/network';
import { UniverRPCMainThreadPlugin } from '@univerjs/rpc';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsFormulaUIPlugin } from '@univerjs/sheets-formula-ui';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverSheetsNumfmtUIPlugin } from '@univerjs/sheets-numfmt-ui';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverUIPlugin } from '@univerjs/ui';

// NOTE: here we copy code from everything.ts. That file (along with the package itself) would be removed in the future.
import '@univerjs/network/facade';
import '@univerjs/sheets/facade';
import '@univerjs/ui/facade';
import '@univerjs/docs-ui/facade';
import '@univerjs/sheets-ui/facade';
import '@univerjs/engine-formula/facade';
import '@univerjs/sheets-formula/facade';
import '@univerjs/sheets-numfmt/facade';
import '@univerjs/sheets-formula-ui/facade';
import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/docs-ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';
import '@univerjs/sheets-formula-ui/lib/index.css';
import '@univerjs/sheets-numfmt-ui/lib/index.css';

export type * from '@univerjs/docs-ui/facade';
export type * from '@univerjs/engine-formula/facade';
export type * from '@univerjs/network/facade';
export type * from '@univerjs/sheets-formula-ui/facade';
export type * from '@univerjs/sheets-formula/facade';
export type * from '@univerjs/sheets-numfmt/facade';
export type * from '@univerjs/sheets-ui/facade';
export type * from '@univerjs/sheets/facade';
export type * from '@univerjs/ui/facade';

export interface IUniverSheetsCorePresetConfig extends
    Pick<IUniverUIConfig, 'container' | 'header' | 'footer' | 'toolbar' | 'menu' | 'contextMenu' | 'disableAutoFocus'>,
    Pick<IUniverSheetsUIConfig, 'formulaBar' | 'statusBarStatistic' | 'customComponents'>,
    IUniverSheetsNumfmtConfig {

    /**
     * The formula configuration.
     */
    formula?: IUniverFormulaConfig;

    /**
     * The URL of the worker script.
     */
    workerURL: IUniverRPCMainThreadConfig['workerURL'];
}

/**
 * This presets helps you to create a Univer sheet with open sourced features.
 */
export function UniverSheetsCorePreset(config: Partial<IUniverSheetsCorePresetConfig> = {}): IPreset {
    const {
        container = 'app',
        workerURL: workerSrc,
        header,
        footer,
        toolbar,
        formulaBar,
        statusBarStatistic,
        menu,
        contextMenu,
        disableAutoFocus,
        formula,
        customComponents,
        disableTextFormatAlert,
        disableTextFormatMark,
    } = config;

    const useWorker = !!workerSrc;

    return {
        plugins: [
            UniverNetworkPlugin,
            UniverDocsPlugin,
            UniverRenderEnginePlugin,
            [UniverUIPlugin, {
                container,
                header,
                footer,
                toolbar,
                menu,
                contextMenu,
                disableAutoFocus,
            }],
            UniverDocsUIPlugin,
            useWorker
                ? [UniverRPCMainThreadPlugin, { workerURL: workerSrc }]
                : null,
            [UniverFormulaEnginePlugin, {
                notExecuteFormula: useWorker,
                function: formula?.function,
            }],
            [UniverSheetsPlugin, {
                notExecuteFormula: useWorker,
                onlyRegisterFormulaRelatedMutations: false,
            }],
            [UniverSheetsUIPlugin, {
                customComponents,
                formulaBar,
                statusBarStatistic,
            }],
            [UniverSheetsNumfmtPlugin, {
                disableTextFormatAlert,
                disableTextFormatMark,
            }],
            UniverSheetsNumfmtUIPlugin,
            [UniverSheetsFormulaPlugin, {
                notExecuteFormula: useWorker,
                description: formula?.description,
            }],
            UniverSheetsFormulaUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
