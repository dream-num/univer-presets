import type { IUniverConfig } from '@univerjs/core';
import type { IPreset } from '../../../type';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsDrawingUIPlugin } from '@univerjs/docs-drawing-ui';
import { UniverDocsHyperLinkUIPlugin } from '@univerjs/docs-hyper-link-ui';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { IImageIoService, UniverDrawingPlugin } from '@univerjs/drawing';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { type IUniverUIConfig, UniverUIPlugin } from '@univerjs/ui';

import '@univerjs/docs-ui/facade';

export interface IUniverDocsBasicPresetConfig extends
    Pick<IUniverUIConfig, 'container' | 'header' | 'footer' | 'toolbar' | 'menu' | 'contextMenu' | 'disableAutoFocus'> {
    collaboration?: true;
    locales?: IUniverConfig['locales'];
}

export function UniverDocsBasicPreset(config: Partial<IUniverDocsBasicPresetConfig> = {}): IPreset {
    const {
        container = 'app',
        collaboration = undefined,
        locales,
    } = config;

    return {
        locales,
        plugins: [
            UniverDocsPlugin,
            UniverRenderEnginePlugin,
            UniverFormulaEnginePlugin,
            [UniverUIPlugin, { container }],
            UniverDocsUIPlugin,

            [UniverDrawingPlugin, { override: collaboration ? [[IImageIoService, null]] : [] }],
            UniverDocsDrawingUIPlugin,

            UniverDocsHyperLinkUIPlugin,
        ],
    };
}
