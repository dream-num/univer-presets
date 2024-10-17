import type { IPreset } from '../../type';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverDrawingPlugin } from '@univerjs/drawing';
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

/**
 * This presets helps you to create a Univer sheet with full open sourced features.
 */
export const univerSheetsBasicPreset: IPreset = {
    plugins: [
        // basic plugins
        UniverDocsPlugin,
        UniverRenderEnginePlugin,
        [UniverUIPlugin, { container: 'app' }],
        UniverDocsUIPlugin,
        UniverFormulaEnginePlugin,

        UniverSheetsPlugin,
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

        UniverDrawingPlugin,
        UniverDrawingUIPlugin,
        UniverSheetsDrawingPlugin,
        UniverSheetsDrawingUIPlugin,

        UniverFindReplacePlugin,
        UniverSheetsFindReplacePlugin,

        UniverSheetsCrosshairHighlightPlugin,
    ],
};
