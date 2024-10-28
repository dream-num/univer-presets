import type { IPreset } from '../../types';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { type IUniverUIConfig, UniverUIPlugin } from '@univerjs/ui';

import '@univerjs/docs-ui/facade';

export interface IUniverDocsCorePresetConfig extends
    Pick<IUniverUIConfig, 'container' | 'header' | 'footer' | 'toolbar' | 'menu' | 'contextMenu' | 'disableAutoFocus'> {
    collaboration?: true;
}

export function UniverDocsCorePreset(config: Partial<IUniverDocsCorePresetConfig> = {}): IPreset {
    const {
        container = 'app',
    } = config;

    return {
        plugins: [
            UniverDocsPlugin,
            UniverRenderEnginePlugin,
            UniverFormulaEnginePlugin,
            [UniverUIPlugin, { container }],
            UniverDocsUIPlugin,
        ],
    };
}
