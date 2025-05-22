import type { IPreset } from './types';

import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing';
import { UniverDrawingPlugin } from '@univerjs/drawing';
import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui';
import { UniverSheetsDrawingPlugin } from '@univerjs/sheets-drawing';
import { UniverSheetsDrawingUIPlugin } from '@univerjs/sheets-drawing-ui';

import '@univerjs/sheets-drawing-ui/lib/facade';

import '@univerjs/drawing-ui/lib/index.css';
import '@univerjs/sheets-drawing-ui/lib/index.css';

export type * from '@univerjs/sheets-drawing-ui/lib/facade';

export interface IUniverSheetsDrawingPresetConfig {
}

export function UniverSheetsDrawingPreset(_config: Partial<IUniverSheetsDrawingPresetConfig> = {}): IPreset {
    return {
        plugins: [
            UniverDrawingPlugin,
            UniverDocsDrawingPlugin,
            UniverDrawingUIPlugin,
            UniverSheetsDrawingPlugin,
            UniverSheetsDrawingUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
