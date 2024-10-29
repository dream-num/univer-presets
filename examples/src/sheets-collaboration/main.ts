import { createUniver, defaultTheme, LocaleType, Tools } from '@univerjs/presets';
import { UniverSheetsAdvancedPreset } from '@univerjs/presets/preset-sheets-advanced';
import sheetsAdvancedZhCN from '@univerjs/presets/preset-sheets-advanced/locales/zh-CN';
import { UniverSheetsCollaborationPreset } from '@univerjs/presets/preset-sheets-collaboration';
import sheetsCollaborationZhCN from '@univerjs/presets/preset-sheets-collaboration/locales/zh-CN';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsThreadCommentPreset } from '@univerjs/presets/preset-sheets-thread-comment';

createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: Tools.deepMerge(
            {},
            sheetsCoreZhCN,
            sheetsAdvancedZhCN,
            sheetsCollaborationZhCN,
        ),
    },
    theme: defaultTheme,
    collaboration: true,
    presets: [
        UniverSheetsCorePreset(),
        UniverSheetsAdvancedPreset(),
        UniverSheetsCollaborationPreset(),
        UniverSheetsThreadCommentPreset({ collaboration: true }),
    ],
});
