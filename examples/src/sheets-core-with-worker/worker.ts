import { createUniver, LocaleType } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import zhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';

createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN,
    },
    presets: [
        UniverSheetsCorePreset(),
    ],
});
