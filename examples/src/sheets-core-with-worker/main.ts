import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';

import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import zhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsFilterPreset } from '@univerjs/presets/preset-sheets-filter';
import sheetsFilterZhCN from '@univerjs/presets/preset-sheets-filter/locales/zh-CN';

import '@univerjs/presets/lib/styles/preset-sheets-core.css';
import '@univerjs/presets/lib/styles/preset-sheets-filter.css';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN,
        sheetsFilterZhCN,
    },
    theme: defaultTheme,
    presets: [
        UniverSheetsCorePreset({
            workerURL: new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
        }),
        UniverSheetsFilterPreset(),
    ],
});

univerAPI.createWorkbook({ name: 'Test Sheet' });

window.univerAPI = univerAPI;

declare global{
    interface Window {
        univerAPI: any;
    }
}
