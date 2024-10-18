import { LocaleType, LogLevel } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { createUniver } from '@univerjs/presets';
import { UniverSheetsAdvancedWorkerPreset } from '@univerjs/presets/sheets/sheets-advanced-features/web-worker';
import { zhCN as advancedZhCN } from '@univerjs/presets/sheets/sheets-advanced-features/zh-CN';
import { UniverSheetsBasicWorkerPreset } from '@univerjs/presets/sheets/sheets-basic/web-worker';
import { zhCN as basicZhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';

createUniver({
    logLevel: LogLevel.INFO,
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    presets: [
        UniverSheetsBasicWorkerPreset({ locales: { zhCN: basicZhCN } }),
        UniverSheetsAdvancedWorkerPreset({ locales: { zhCN: advancedZhCN } }),
    ],
});
