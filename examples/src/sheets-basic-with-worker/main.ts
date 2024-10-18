import { LocaleType, LogLevel } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { createUniver } from '@univerjs/presets';
import { UniverSheetsBasicPreset } from '@univerjs/presets/sheets/sheets-basic/index';
import { zhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';

const { univerAPI } = createUniver({
    logLevel: LogLevel.INFO,
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    presets: [
        UniverSheetsBasicPreset({
            locales: { zhCN },
            workerURL: new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
        }),
    ],
});

univerAPI.createUniverSheet({ name: 'Test Sheet' });
