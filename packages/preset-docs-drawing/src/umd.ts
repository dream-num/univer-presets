import type { IPreset } from './types';

import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing';
import { UniverDocsDrawingUIPlugin } from '@univerjs/docs-drawing-ui';
import { UniverDrawingPlugin } from '@univerjs/drawing';
import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui';

import '@univerjs/drawing-ui/lib/index.css';
import '@univerjs/docs-drawing-ui/lib/index.css';

export interface IUniverDocsDrawingPresetConfig {
}

export function UniverDocsDrawingPreset(_config: Partial<IUniverDocsDrawingPresetConfig> = {}): IPreset {
    return {
        plugins: [
            UniverDrawingPlugin,
            UniverDrawingUIPlugin,
            UniverDocsDrawingPlugin,
            UniverDocsDrawingUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
