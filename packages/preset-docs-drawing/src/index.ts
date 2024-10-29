import type { IPreset } from '../../types';

import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing';
import { UniverDocsDrawingUIPlugin } from '@univerjs/docs-drawing-ui';
import { IImageIoService, UniverDrawingPlugin } from '@univerjs/drawing';
import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui';

export interface IUniverDocsDrawingPresetConfig {
    collaboration?: boolean;
}

export function UniverDocsCorePreset(config: Partial<IUniverDocsDrawingPresetConfig> = {}): IPreset {
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
