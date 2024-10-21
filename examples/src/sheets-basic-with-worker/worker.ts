import { createUniver, LocaleType } from '@univerjs/presets';
import { UniverSheetsBasicWorkerPreset } from '@univerjs/presets/sheets/sheets-basic/web-worker';
import { zhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';

createUniver({
    locale: LocaleType.ZH_CN,
    presets: [
        UniverSheetsBasicWorkerPreset({ locales: { zhCN } }),
    ],
});
