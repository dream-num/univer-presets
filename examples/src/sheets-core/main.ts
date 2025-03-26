import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets';

import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';

import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import sheetsZenEditorZhCN from '@univerjs/sheets-zen-editor/locale/zh-CN';

import '@univerjs/presets/lib/styles/preset-sheets-core.css';
import '@univerjs/sheets-zen-editor/lib/index.css';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: merge(
            {},
            sheetsCoreZhCN,
            sheetsZenEditorZhCN,
        ),
    },
    theme: defaultTheme,
    presets: [
        UniverSheetsCorePreset({
            disableTextFormatAlert: true,
            disableTextFormatMark: true,
        }),
    ],
    plugins: [UniverSheetsZenEditorPlugin],
});

univerAPI.createWorkbook({ name: 'Test Sheet' });

window.univerAPI = univerAPI;

declare global{
    interface Window {
        univerAPI: any;
    }
}
