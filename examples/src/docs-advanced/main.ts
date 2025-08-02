import { createUniver, defaultTheme, LocaleType, mergeLocales } from '@univerjs/presets';

import { UniverDocsAdvancedPreset } from '@univerjs/presets/preset-docs-advanced';
import docsAdvancedZhCN from '@univerjs/presets/preset-docs-advanced/locales/zh-CN';

import { UniverDocsCorePreset } from '@univerjs/presets/preset-docs-core';
import docsCoreZhCN from '@univerjs/presets/preset-docs-core/locales/zh-CN';

import { UniverDocsDrawingPreset } from '@univerjs/presets/preset-docs-drawing';
import docsDrawingZhCN from '@univerjs/presets/preset-docs-drawing/locales/zh-CN';

import { UniverDocsHyperLinkPreset } from '@univerjs/presets/preset-docs-hyper-link';
import docsHyperLinkZhCN from '@univerjs/presets/preset-docs-hyper-link/locales/zh-CN';

import '@univerjs/presets/lib/styles/preset-docs-core.css';
import '@univerjs/presets/lib/styles/preset-docs-advanced.css';
import '@univerjs/presets/lib/styles/preset-docs-drawing.css';
import '@univerjs/presets/lib/styles/preset-docs-hyper-link.css';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: mergeLocales(
            docsCoreZhCN,
            docsAdvancedZhCN,
            docsDrawingZhCN,
            docsHyperLinkZhCN,
        ),
    },
    theme: defaultTheme,
    presets: [
        UniverDocsCorePreset(),
        UniverDocsDrawingPreset(),
        UniverDocsAdvancedPreset({
            universerEndpoint: 'https://dev.univer.plus',
        }),
        UniverDocsHyperLinkPreset(),
    ],
});

univerAPI.createUniverDoc({});

window.univerAPI = univerAPI;

declare global {
    interface Window {
        univerAPI: any;
    }
}
