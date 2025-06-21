import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets';

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
import sheetsFindReplaceZhCN from '@univerjs/presets/preset-sheets-find-replace/locales/zh-CN';

import { UniverSheetsHyperLinkPreset } from '@univerjs/presets/preset-sheets-hyper-link';
import sheetsHyperLinkZhCN from '@univerjs/presets/preset-sheets-hyper-link/locales/zh-CN';

import { UniverSheetsSortPreset } from '@univerjs/presets/preset-sheets-sort';
import sheetsSortZhCN from '@univerjs/presets/preset-sheets-sort/locales/zh-CN';

import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import sheetsZenEditorZhCN from '@univerjs/sheets-zen-editor/locale/zh-CN';

import '@univerjs/presets/lib/styles/preset-sheets-core.css';
import '@univerjs/presets/lib/styles/preset-sheets-conditional-formatting.css';
import '@univerjs/presets/lib/styles/preset-sheets-data-validation.css';
import '@univerjs/presets/lib/styles/preset-sheets-drawing.css';
import '@univerjs/presets/lib/styles/preset-sheets-filter.css';
import '@univerjs/presets/lib/styles/preset-sheets-find-replace.css';
import '@univerjs/presets/lib/styles/preset-sheets-hyper-link.css';
import '@univerjs/presets/lib/styles/preset-sheets-sort.css';
import '@univerjs/sheets-zen-editor/lib/index.css';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: merge(
            {},
            sheetsCoreZhCN,
            sheetsZenEditorZhCN,
            sheetsConditionalFormattingZhCN,
            sheetsDataValidationZhCN,
            sheetsFilterZhCN,
            sheetsSortZhCN,
            sheetsHyperLinkZhCN,
            sheetsDrawingZhCN,
            sheetsFindReplaceZhCN,
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

univerAPI.createWorkbook({ name: 'Test Sheet' });

window.univerAPI = univerAPI;

declare global {
    interface Window {
        univerAPI: any;
    }
}
