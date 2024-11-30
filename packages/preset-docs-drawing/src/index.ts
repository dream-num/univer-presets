import type { IPreset } from './types';

import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing';
import { UniverDocsDrawingUIPlugin } from '@univerjs/docs-drawing-ui';
import { IImageIoService, UniverDrawingPlugin } from '@univerjs/drawing';
import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui';

import '@univerjs/drawing-ui/lib/index.css';
import '@univerjs/docs-drawing-ui/lib/index.css';

export * from '@univerjs/docs-drawing';
export * from '@univerjs/docs-drawing-ui';
export * from '@univerjs/drawing';
export * from '@univerjs/drawing-ui';

export interface IUniverDocsDrawingPresetConfig {
    collaboration?: boolean;
}

export function UniverDocsDrawingPreset(config: Partial<IUniverDocsDrawingPresetConfig> = {}): IPreset {
    const { collaboration = false } = config;

    return {
        plugins: [
            [UniverDrawingPlugin, { override: collaboration ? [[IImageIoService, null]] : [] }],
            UniverDrawingUIPlugin,
            UniverDocsDrawingPlugin,
            UniverDocsDrawingUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
