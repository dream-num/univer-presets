import { createUniver, defaultTheme, LocaleType, Tools } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import sheetsZenEditorZhCN from '@univerjs/sheets-zen-editor/locale/zh-CN';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: Tools.deepMerge(
            {},
            sheetsCoreZhCN,
            sheetsZenEditorZhCN,
        ),
    },
    theme: defaultTheme,
    presets: [
        UniverSheetsCorePreset(),
    ],
    plugins: [UniverSheetsZenEditorPlugin],
});

univerAPI.createUniverSheet({ name: 'Test Sheet' });
