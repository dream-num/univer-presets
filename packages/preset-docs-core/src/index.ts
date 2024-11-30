import type { IPreset } from './types';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { type IUniverUIConfig, UniverUIPlugin } from '@univerjs/ui';

import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/docs-ui/lib/index.css';

import '@univerjs/docs-ui/facade';

export interface IUniverDocsCorePresetConfig extends
    Pick<IUniverUIConfig, 'container' | 'header' | 'footer' | 'toolbar' | 'menu' | 'contextMenu' | 'disableAutoFocus'> {
    collaboration?: true;
}

export function UniverDocsCorePreset(config: Partial<IUniverDocsCorePresetConfig> = {}): IPreset {
    const {
        container = 'app',
        header,
        footer,
        toolbar,
        menu,
        contextMenu,
        disableAutoFocus,
    } = config;

    return {
        plugins: [
            UniverDocsPlugin,
            UniverRenderEnginePlugin,
            UniverFormulaEnginePlugin,
            [UniverUIPlugin, {
                container,
                header,
                footer,
                toolbar,
                menu,
                contextMenu,
                disableAutoFocus,
            }],
            UniverDocsUIPlugin,
        ],
    };
}
