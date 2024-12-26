import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';

import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import zhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';

import '@univerjs/presets/lib/styles/preset-sheets-core.css';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN,
    },
    theme: defaultTheme,
    presets: [
        UniverSheetsCorePreset({
            workerURL: new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
        }),
    ],
});

univerAPI.createUniverSheet({ name: 'Test Sheet' });
