import type { IUniverRPCMainThreadConfig } from '@univerjs/rpc';
import type { IUniverSheetsNumfmtConfig } from '@univerjs/sheets-numfmt';
import type { IUniverSheetsUIConfig } from '@univerjs/sheets-ui';
import type { IUniverUIConfig } from '@univerjs/ui';
import type { IPreset, IUniverDocsPresetConfig, IUniverFormulaConfig, IUniverSheetsPresetConfig } from './types';
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
import '@univerjs/network/lib/facade';
import '@univerjs/sheets/lib/facade';
import '@univerjs/ui/lib/facade';
import '@univerjs/docs-ui/lib/facade';
import '@univerjs/sheets-ui/lib/facade';
import '@univerjs/engine-formula/lib/facade';
import '@univerjs/sheets-formula/lib/facade';
import '@univerjs/sheets-numfmt/lib/facade';
import '@univerjs/sheets-formula-ui/lib/facade';
import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/docs-ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';
import '@univerjs/sheets-formula-ui/lib/index.css';
import '@univerjs/sheets-numfmt-ui/lib/index.css';

export type * from '@univerjs/docs-ui/lib/facade';
export type * from '@univerjs/engine-formula/lib/facade';
export type * from '@univerjs/network/lib/facade';
export type * from '@univerjs/sheets-formula-ui/lib/facade';
export type * from '@univerjs/sheets-formula/lib/facade';
export type * from '@univerjs/sheets-numfmt/lib/facade';
export type * from '@univerjs/sheets-ui/lib/facade';
export type * from '@univerjs/sheets/lib/facade';
export type * from '@univerjs/ui/lib/facade';

export interface IUniverSheetsCorePresetConfig extends
    Pick<IUniverUIConfig, 'container' | 'header' | 'footer' | 'toolbar' | 'menu' | 'contextMenu' | 'disableAutoFocus'>,
    Pick<IUniverSheetsUIConfig, 'formulaBar' | 'statusBarStatistic' | 'customComponents'>,
    IUniverSheetsNumfmtConfig {

    /**
     * The docs related configuration.
     */
    docs?: IUniverDocsPresetConfig;

    /**
     * The sheets related configuration.
     */
    sheets?: IUniverSheetsPresetConfig;

    /**
     * The formula related configuration.
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
        docs,
        sheets,
        formula,
        customComponents,
        disableTextFormatAlert,
        disableTextFormatMark,
    } = config;

    const useWorker = !!workerSrc;

    return {
        plugins: [
            UniverNetworkPlugin,
            [UniverDocsPlugin, {
                hasScroll: docs?.hasScroll,
            }],
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
                isRowStylePrecedeColumnStyle: sheets?.isRowStylePrecedeColumnStyle,
                autoHeightForMergedCells: sheets?.autoHeightForMergedCells,
            }],
            [UniverSheetsUIPlugin, {
                customComponents,
                formulaBar,
                statusBarStatistic,
                maxAutoHeightCount: sheets?.maxAutoHeightCount,
                clipboardConfig: sheets?.clipboardConfig,
                scrollConfig: sheets?.scrollConfig,
            }],
            [UniverSheetsNumfmtPlugin, {
                disableTextFormatAlert,
                disableTextFormatMark,
            }],
            UniverSheetsNumfmtUIPlugin,
            [UniverSheetsFormulaPlugin, {
                notExecuteFormula: useWorker,
                description: formula?.description,
                initialFormulaComputing: formula?.initialFormulaComputing,
            }],
            UniverSheetsFormulaUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
