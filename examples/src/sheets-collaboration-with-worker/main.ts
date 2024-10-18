import { LocaleType, LogLevel } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { createUniver } from '@univerjs/presets';
import { UniverSheetsAdvancedPreset } from '@univerjs/presets/sheets/sheets-advanced-features/index';
import { zhCN as advancedZhCN } from '@univerjs/presets/sheets/sheets-advanced-features/zh-CN';
import { UniverSheetsBasicPreset } from '@univerjs/presets/sheets/sheets-basic/index';
import { zhCN as basicZhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';
import { UniverSheetsCollaborationPreset } from '@univerjs/presets/sheets/sheets-collaboration/index';
import { zhCN as collaborationZhCN } from '@univerjs/presets/sheets/sheets-collaboration/zh-CN';

createUniver({
    logLevel: LogLevel.INFO,
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    collaboration: true,
    presets: [
        UniverSheetsBasicPreset({
            locales: { zhCN: basicZhCN },
            collaboration: true,
            workerURL: new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
        }),
        UniverSheetsAdvancedPreset({
            locales: { zhCN: advancedZhCN },
            useWorker: true,
        }),
        UniverSheetsCollaborationPreset({ locales: { zhCN: collaborationZhCN } }),
    ],
});
