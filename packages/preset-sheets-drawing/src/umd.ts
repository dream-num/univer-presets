import type { IPreset } from './types';

import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing';
import { IImageIoService, UniverDrawingPlugin } from '@univerjs/drawing';
import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui';
import { UniverSheetsDrawingPlugin } from '@univerjs/sheets-drawing';
import { UniverSheetsDrawingUIPlugin } from '@univerjs/sheets-drawing-ui';

import '@univerjs/drawing-ui/lib/index.css';
import '@univerjs/sheets-drawing-ui/lib/index.css';

export interface IUniverSheetsDrawingPresetConfig {
    collaboration?: boolean;
}

export function UniverSheetsDrawingPreset(config: Partial<IUniverSheetsDrawingPresetConfig> = {}): IPreset {
    const { collaboration = false } = config;

    return {
        plugins: [
            [UniverDrawingPlugin, { override: collaboration ? [[IImageIoService, null]] : [] }],
            UniverDocsDrawingPlugin,
            UniverDrawingUIPlugin,
            UniverSheetsDrawingPlugin,
            UniverSheetsDrawingUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
