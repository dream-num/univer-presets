import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { IPreset } from "../../../type";
import { UniverThreadCommentPlugin } from "@univerjs/thread-comment";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing'
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsDataValidationPlugin } from "@univerjs/sheets-data-validation";
import { UniverSheetsFilterPlugin } from "@univerjs/sheets-filter";
import { UniverSheetsHyperLinkPlugin } from "@univerjs/sheets-hyper-link";
import { UniverSheetsDrawingPlugin } from "@univerjs/sheets-drawing";
import { UniverSheetsSortPlugin } from "@univerjs/sheets-sort";
import { IUniverConfig } from "@univerjs/core";

export interface IUniverSheetsNodeBasicPresetConfig {
    locales?: IUniverConfig['locales'];
}

export function UniverSheetsNodeBasicPreset(config: Partial<IUniverSheetsNodeBasicPresetConfig>): IPreset {
    const {
        locales,
    } = config

    return {
        locales,
        plugins: [
            UniverFormulaEnginePlugin,
            UniverThreadCommentPlugin,

            UniverDocsPlugin,
            UniverDocsDrawingPlugin,

            UniverSheetsPlugin,
            UniverSheetsFormulaPlugin,
            UniverSheetsDataValidationPlugin,
            UniverSheetsFilterPlugin,
            UniverSheetsHyperLinkPlugin,
            UniverSheetsDrawingPlugin,
            UniverSheetsSortPlugin,
        ]
    }
}

