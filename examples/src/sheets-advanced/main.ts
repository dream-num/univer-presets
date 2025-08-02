import { createUniver, defaultTheme, LocaleType, mergeLocales } from '@univerjs/presets';

import { UniverSheetsAdvancedPreset } from '@univerjs/presets/preset-sheets-advanced';
import sheetsAdvancedZhCN from '@univerjs/presets/preset-sheets-advanced/locales/zh-CN';

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

import { UniverSheetsNotePreset } from '@univerjs/presets/preset-sheets-note';
import sheetsNoteZhCN from '@univerjs/presets/preset-sheets-note/locales/zh-CN';

import { UniverSheetsSortPreset } from '@univerjs/presets/preset-sheets-sort';
import sheetsSortZhCN from '@univerjs/presets/preset-sheets-sort/locales/zh-CN';

import { UniverSheetsTablePreset } from '@univerjs/presets/preset-sheets-table';
import sheetsTableZhCN from '@univerjs/presets/preset-sheets-table/locales/zh-CN';

import { UniverSheetsThreadCommentPreset } from '@univerjs/presets/preset-sheets-thread-comment';
import sheetsThreadCommentZhCN from '@univerjs/presets/preset-sheets-thread-comment/locales/zh-CN';

import '@univerjs/presets/lib/styles/preset-sheets-core.css';
import '@univerjs/presets/lib/styles/preset-sheets-advanced.css';
import '@univerjs/presets/lib/styles/preset-sheets-drawing.css';
import '@univerjs/presets/lib/styles/preset-sheets-filter.css';
import '@univerjs/presets/lib/styles/preset-sheets-hyper-link.css';
import '@univerjs/presets/lib/styles/preset-sheets-data-validation.css';
import '@univerjs/presets/lib/styles/preset-sheets-find-replace.css';
import '@univerjs/presets/lib/styles/preset-sheets-note.css';
import '@univerjs/presets/lib/styles/preset-sheets-sort.css';
import '@univerjs/presets/lib/styles/preset-sheets-table.css';
import '@univerjs/presets/lib/styles/preset-sheets-thread-comment.css';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: mergeLocales(
            sheetsCoreZhCN,
            sheetsAdvancedZhCN,
            sheetsDrawingZhCN,
            sheetsFilterZhCN,
            sheetsHyperLinkZhCN,
            sheetsDataValidationZhCN,
            sheetsFindReplaceZhCN,
            sheetsNoteZhCN,
            sheetsSortZhCN,
            sheetsTableZhCN,
            sheetsThreadCommentZhCN,
        ),
    },
    theme: defaultTheme,
    presets: [
        UniverSheetsCorePreset(),
        UniverSheetsFilterPreset(),
        UniverSheetsDrawingPreset(),
        UniverSheetsAdvancedPreset({
            universerEndpoint: 'https://dev.univer.plus',
        }),
        UniverSheetsHyperLinkPreset(),
        UniverSheetsDataValidationPreset(),
        UniverSheetsFindReplacePreset(),
        UniverSheetsNotePreset(),
        UniverSheetsSortPreset(),
        UniverSheetsTablePreset(),
        UniverSheetsThreadCommentPreset(),
    ],
});

univerAPI.createWorkbook({ name: 'Test Sheet' });

window.univerAPI = univerAPI;

declare global {
    interface Window {
        univerAPI: any;
    }
}
