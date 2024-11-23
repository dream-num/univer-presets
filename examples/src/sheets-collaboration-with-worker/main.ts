import { createUniver, defaultTheme, LocaleType, Tools } from '@univerjs/presets';
import { UniverSheetsAdvancedPreset } from '@univerjs/presets/preset-sheets-advanced';
import sheetsAdvancedZhCN from '@univerjs/presets/preset-sheets-advanced/locales/zh-CN';
import { UniverSheetsCollaborationPreset } from '@univerjs/presets/preset-sheets-collaboration';
import sheetsCollaborationZhCN from '@univerjs/presets/preset-sheets-collaboration/locales/zh-CN';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import { UniverSheetsDrawingPreset } from '@univerjs/presets/preset-sheets-drawing';

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
        UniverSheetsCorePreset({
            workerURL: new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
        }),
        UniverSheetsDrawingPreset({
            collaboration: true,
        }),
        UniverSheetsAdvancedPreset({
            useWorker: true,
            // if you want to use the no-limit business feature, you can get 30-day trial license from https://univer.ai/pro/license
            // eslint-disable-next-line node/prefer-global/process
            license: process.env.UNIVER_CLIENT_LICENSE || 'your license.txt',
        }),
        UniverSheetsCollaborationPreset(),
    ],
});
