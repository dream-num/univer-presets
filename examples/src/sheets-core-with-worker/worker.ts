import { createUniver, LocaleType } from '@univerjs/presets';
import zhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsCoreWorkerPreset } from '@univerjs/presets/preset-sheets-core/worker';

createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN,
    },
    presets: [
        UniverSheetsCoreWorkerPreset(),
    ],
});
