import { createUniver, LocaleType } from '@univerjs/presets';
import zhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsCoreWorkerPreset } from '@univerjs/presets/preset-sheets-core/worker';
import sheetsFilterZhCN from '@univerjs/presets/preset-sheets-filter/locales/zh-CN';
import { UniverSheetsFilterWorkerPreset } from '@univerjs/presets/preset-sheets-filter/worker';

createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN,
        sheetsFilterZhCN,
    },
    presets: [
        UniverSheetsCoreWorkerPreset(),
        UniverSheetsFilterWorkerPreset(),
    ],
});
