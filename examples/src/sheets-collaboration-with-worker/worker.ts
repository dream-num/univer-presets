import { createUniver, LocaleType, Tools } from '@univerjs/presets';
import sheetsAdvancedZhCN from '@univerjs/presets/preset-sheets-advanced/locales/zh-CN';
import { UniverSheetsAdvancedWorkerPreset } from '@univerjs/presets/preset-sheets-advanced/worker';
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsCoreWorkerPreset } from '@univerjs/presets/preset-sheets-core/worker';

createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: Tools.deepMerge(
            {},
            sheetsCoreZhCN,
            sheetsAdvancedZhCN,
        ),
    },
    presets: [
        UniverSheetsCoreWorkerPreset(),
        UniverSheetsAdvancedWorkerPreset(),
    ],
});
