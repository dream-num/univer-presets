import { createUniver, LocaleType } from '@univerjs/presets';
import { UniverSheetsAdvancedWorkerPreset } from '@univerjs/presets/sheets/sheets-advanced-features/web-worker';
import { zhCN as advancedZhCN } from '@univerjs/presets/sheets/sheets-advanced-features/zh-CN';
import { UniverSheetsBasicWorkerPreset } from '@univerjs/presets/sheets/sheets-basic/web-worker';
import { zhCN as basicZhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';

createUniver({
    locale: LocaleType.ZH_CN,
    presets: [
        UniverSheetsBasicWorkerPreset({ locales: { zhCN: basicZhCN } }),
        UniverSheetsAdvancedWorkerPreset({ locales: { zhCN: advancedZhCN } }),
    ],
});
