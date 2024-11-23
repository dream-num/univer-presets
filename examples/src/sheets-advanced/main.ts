import { createUniver, defaultTheme, LocaleType, Tools } from '@univerjs/presets';
import { UniverSheetsAdvancedPreset } from '@univerjs/presets/preset-sheets-advanced';
import sheetsAdvancedZhCN from '@univerjs/presets/preset-sheets-advanced/locales/zh-CN';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsDrawingPreset } from '@univerjs/presets/preset-sheets-drawing';
import { UniverSheetsFilterPreset } from '@univerjs/presets/preset-sheets-filter';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: Tools.deepMerge(
            {},
            sheetsCoreZhCN,
            sheetsAdvancedZhCN,
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
    ],
});

univerAPI.createUniverSheet({ name: 'Test Sheet' });
