import type { IUniverConfig } from '@univerjs/core';
import type { IUniverSheetsConfig } from '@univerjs/sheets';
import type { IUniverSheetsUIConfig } from '@univerjs/sheets-ui';
import type { IUniverUIConfig } from '@univerjs/ui';
import type { IPreset } from '../../../type';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { IImageIoService, UniverDrawingPlugin } from '@univerjs/drawing';
import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverFindReplacePlugin } from '@univerjs/find-replace';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui';
import { UniverSheetsCrosshairHighlightPlugin } from '@univerjs/sheets-crosshair-highlight';
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsDataValidationUIPlugin } from '@univerjs/sheets-data-validation-ui';
import { UniverSheetsDrawingPlugin } from '@univerjs/sheets-drawing';
import { UniverSheetsDrawingUIPlugin } from '@univerjs/sheets-drawing-ui';
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverSheetsFilterUIPlugin } from '@univerjs/sheets-filter-ui';
import { UniverSheetsFindReplacePlugin } from '@univerjs/sheets-find-replace';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsFormulaUIPlugin } from '@univerjs/sheets-formula-ui';
import { UniverSheetsHyperLinkPlugin } from '@univerjs/sheets-hyper-link';
import { UniverSheetsHyperLinkUIPlugin } from '@univerjs/sheets-hyper-link-ui';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverSheetsSortPlugin } from '@univerjs/sheets-sort';
import { UniverSheetsSortUIPlugin } from '@univerjs/sheets-sort-ui';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverUIPlugin } from '@univerjs/ui';

import { ImageIoService } from '@univerjs-pro/collaboration-client';
// NOTE: here we copy code from everything.ts. That file (along with the package itself) would be removed in the future.
import '@univerjs/sheets/facade';
import '@univerjs/ui/facade';
import '@univerjs/docs-ui/facade';
import '@univerjs/sheets-ui/facade';
import '@univerjs/sheets-data-validation/facade';
import '@univerjs/engine-formula/facade';
import '@univerjs/sheets-filter/facade';
import '@univerjs/sheets-formula/facade';
import '@univerjs/sheets-numfmt/facade';
import '@univerjs/sheets-hyper-link-ui/facade';

export interface IUniverSheetsBasicPresetConfig extends
    Pick<IUniverUIConfig, 'container' | 'header' | 'footer' | 'toolbar' | 'menu' | 'contextMenu' | 'disableAutoFocus'>,
    Pick<IUniverSheetsConfig, 'notExecuteFormula' | 'onlyRegisterFormulaRelatedMutations'>,
    Pick<IUniverSheetsUIConfig, 'formulaBar'> {

    /**
     *
     */
    enableWebWorker?: true;

    collaboration?: true;
    locales?: IUniverConfig['locales'];

    // TODO: add other config keys
}

/**
 * This presets helps you to create a Univer sheet with open sourced features.
 */
export function UniverSheetsBasicPreset(config: Partial<IUniverSheetsBasicPresetConfig> = {}): IPreset {
    const {
        container = 'app',
        notExecuteFormula,
        onlyRegisterFormulaRelatedMutations,
        collaboration = undefined,
        // enableWebWorker = false,
        locales,
    } = config;

    return {
        locales,
        plugins: [
            UniverDocsPlugin,
            UniverRenderEnginePlugin,
            [UniverUIPlugin, { container }],
            UniverDocsUIPlugin,
            UniverFormulaEnginePlugin,

            [UniverSheetsPlugin, { notExecuteFormula, onlyRegisterFormulaRelatedMutations }],
            UniverSheetsUIPlugin,
            UniverSheetsNumfmtPlugin,

            UniverSheetsFormulaPlugin,
            UniverSheetsFormulaUIPlugin,

            UniverSheetsDataValidationPlugin,
            UniverSheetsDataValidationUIPlugin,

            UniverSheetsConditionalFormattingPlugin,
            UniverSheetsConditionalFormattingUIPlugin,

            UniverSheetsFilterPlugin,
            UniverSheetsFilterUIPlugin,

            UniverSheetsSortPlugin,
            UniverSheetsSortUIPlugin,

            UniverSheetsHyperLinkPlugin,
            UniverSheetsHyperLinkUIPlugin,

            [UniverDrawingPlugin, {
                override: collaboration ? [[IImageIoService, null]] : [],
            }],
            UniverDrawingUIPlugin,
            UniverSheetsDrawingPlugin,
            UniverSheetsDrawingUIPlugin,

            UniverFindReplacePlugin,
            UniverSheetsFindReplacePlugin,

            UniverSheetsCrosshairHighlightPlugin,
        ],
    };
};
