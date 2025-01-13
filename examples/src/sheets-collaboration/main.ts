import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets';

import { UniverSheetsAdvancedPreset } from '@univerjs/presets/preset-sheets-advanced';
import sheetsAdvancedZhCN from '@univerjs/presets/preset-sheets-advanced/locales/zh-CN';

import { UniverSheetsCollaborationPreset } from '@univerjs/presets/preset-sheets-collaboration';
import sheetsCollaborationZhCN from '@univerjs/presets/preset-sheets-collaboration/locales/zh-CN';

import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';

import { UniverSheetsDrawingPreset } from '@univerjs/presets/preset-sheets-drawing';
import sheetsDrawingZhCN from '@univerjs/presets/preset-sheets-drawing/locales/zh-CN';

import { UniverSheetsFilterPreset } from '@univerjs/presets/preset-sheets-filter';
import sheetsSheetsFilterZhCN from '@univerjs/presets/preset-sheets-filter/locales/zh-CN';

import { UniverSheetsThreadCommentPreset } from '@univerjs/presets/preset-sheets-thread-comment';
import sheetsThreadCommentZhCN from '@univerjs/presets/preset-sheets-thread-comment/locales/zh-CN';

import '@univerjs/presets/lib/styles/preset-sheets-advanced.css';
import '@univerjs/presets/lib/styles/preset-sheets-collaboration.css';
import '@univerjs/presets/lib/styles/preset-sheets-core.css';
import '@univerjs/presets/lib/styles/preset-sheets-thread-comment.css';
import '@univerjs/presets/lib/styles/preset-sheets-drawing.css';
import '@univerjs/presets/lib/styles/preset-sheets-filter.css';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: merge(
            {},
            sheetsCoreZhCN,
            sheetsAdvancedZhCN,
            sheetsCollaborationZhCN,
            sheetsThreadCommentZhCN,
            sheetsDrawingZhCN,
            sheetsSheetsFilterZhCN,
        ),
    },
    theme: defaultTheme,
    collaboration: true,
    presets: [
        UniverSheetsCorePreset(),
        UniverSheetsDrawingPreset({ collaboration: true }),
        UniverSheetsAdvancedPreset(),
        UniverSheetsThreadCommentPreset(),
        UniverSheetsFilterPreset(),
        UniverSheetsCollaborationPreset(),
    ],
});

window.univerAPI = univerAPI;

declare global{
    interface Window {
        univerAPI: any;
    }
}
