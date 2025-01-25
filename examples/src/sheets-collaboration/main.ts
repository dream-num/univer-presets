import { createUniver, defaultTheme, LocaleType, merge, UniverInstanceType } from '@univerjs/presets';

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

// check if the unit is already created
const url = new URL(window.location.href);
const unit = url.searchParams.get('unit');
if (unit) {
    // waiting for the unit to be loaded
}
else {
    fetch(`/universer-api/snapshot/2/unit/-/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: UniverInstanceType.UNIVER_SHEET,
            name: 'New Sheet By Univer',
            creator: 'user',
        }),
    })
        .then((response) => {
            if (!response.ok)
                throw new Error('Failed to create new sheet');

            return response.json();
        })
        .then((data) => {
            if (!data.unitID)
                throw new Error('create unit failed');

            url.searchParams.set('unit', data.unitID);
            url.searchParams.set('type', String(UniverInstanceType.UNIVER_SHEET));
            window.location.href = url.toString();
        })
        .catch((error) => {
            console.error(error);
        });
}

declare global{
    interface Window {
        univerAPI: any;
    }
}
