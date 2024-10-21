import { createUniver, LocaleType } from '@univerjs/presets';
import { UniverSheetsBasicWorkerPreset } from '@univerjs/presets/sheets-node/sheets-node-basic/worker';
import { zhCN } from '@univerjs/presets/sheets-node/sheets-node-basic/zh-CN';

createUniver({
    locale: LocaleType.ZH_CN,
    presets: [
        UniverSheetsBasicWorkerPreset({ locales: { zhCN } }),
    ],
});
