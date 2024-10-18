import { LocaleType, LogLevel } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { createUniver } from '@univerjs/presets';
import { UniverSheetsBasicWorkerPreset } from '@univerjs/presets/sheets/sheets-basic/web-worker';
import { zhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';

createUniver({
    logLevel: LogLevel.INFO,
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    presets: [
        UniverSheetsBasicWorkerPreset({ locales: { zhCN } }),
    ],
});
