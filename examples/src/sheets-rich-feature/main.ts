import { createUniver, defaultTheme, LocaleType, Tools } from '@univerjs/presets';
import { UniverSheetsConditionalFormattingPreset } from '@univerjs/presets/preset-sheets-conditional-formatting';
import sheetsConditionalFormattingZhCN from '@univerjs/presets/preset-sheets-conditional-formatting/locales/zh-CN';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsDataValidationPreset } from '@univerjs/presets/preset-sheets-data-validation';
import sheetsDataValidationZhCN from '@univerjs/presets/preset-sheets-data-validation/locales/zh-CN';
import { UniverSheetsDrawingPreset } from '@univerjs/presets/preset-sheets-drawing';
import sheetsDrawingZhCN from '@univerjs/presets/preset-sheets-drawing/locales/zh-CN';
import { UniverSheetsFilterPreset } from '@univerjs/presets/preset-sheets-filter';
import sheetsFilterZhCN from '@univerjs/presets/preset-sheets-filter/locales/zh-CN';
import { UniverSheetsFindReplacePreset } from '@univerjs/presets/preset-sheets-find-replace';
import { UniverSheetsHyperLinkPreset } from '@univerjs/presets/preset-sheets-hyper-link';
import sheetsHyperLinkZhCN from '@univerjs/presets/preset-sheets-hyper-link/locales/zh-CN';
import { UniverSheetsSortPreset } from '@univerjs/presets/preset-sheets-sort';
import sheetsSortZhCN from '@univerjs/presets/preset-sheets-sort/locales/zh-CN';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import sheetsZenEditorZhCN from '@univerjs/sheets-zen-editor/locale/zh-CN';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: Tools.deepMerge(
            {},
            sheetsCoreZhCN,
            sheetsZenEditorZhCN,
            sheetsConditionalFormattingZhCN,
            sheetsDataValidationZhCN,
            sheetsFilterZhCN,
            sheetsSortZhCN,
            sheetsHyperLinkZhCN,
            sheetsDrawingZhCN,
        ),
    },
    theme: defaultTheme,
    presets: [
        UniverSheetsCorePreset(),
        UniverSheetsConditionalFormattingPreset(),
        UniverSheetsDataValidationPreset(),
        UniverSheetsFilterPreset(),
        UniverSheetsFindReplacePreset(),
        UniverSheetsSortPreset(),
        UniverSheetsHyperLinkPreset(),
        UniverSheetsDrawingPreset(),
    ],
    plugins: [UniverSheetsZenEditorPlugin],
});

univerAPI.createUniverSheet({ name: 'Test Sheet' });
