import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';
import { UniverSheetsAdvancedPreset } from '@univerjs/presets/sheets/sheets-advanced-features/index';
import { zhCN as advancedZhCN } from '@univerjs/presets/sheets/sheets-advanced-features/zh-CN';
import { UniverSheetsBasicPreset } from '@univerjs/presets/sheets/sheets-basic/index';
import { zhCN as basicZhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';
import { UniverSheetsCollaborationPreset } from '@univerjs/presets/sheets/sheets-collaboration/index';
import { zhCN as collaborationZhCN } from '@univerjs/presets/sheets/sheets-collaboration/zh-CN';

createUniver({
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    collaboration: true,
    presets: [
        UniverSheetsBasicPreset({ locales: { zhCN: basicZhCN }, collaboration: true }),
        UniverSheetsAdvancedPreset({ locales: { zhCN: advancedZhCN } }),
        UniverSheetsCollaborationPreset({ locales: { zhCN: collaborationZhCN } }),
    ],
});
