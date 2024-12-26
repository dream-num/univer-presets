import { createUniver, defaultTheme, LocaleType, Tools } from '@univerjs/presets';

import { UniverDocsCollaborationPreset } from '@univerjs/presets/preset-docs-collaboration';
import docsCollaborationZhCN from '@univerjs/presets/preset-docs-collaboration/locales/zh-CN';

import { UniverDocsCorePreset } from '@univerjs/presets/preset-docs-core';
import docsCoreZhCN from '@univerjs/presets/preset-docs-core/locales/zh-CN';

import '@univerjs/presets/lib/styles/preset-docs-core.css';
import '@univerjs/presets/lib/styles/preset-docs-collaboration.css';

createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN: Tools.deepMerge(
            {},
            docsCoreZhCN,
            docsCollaborationZhCN,
        ),
    },
    theme: defaultTheme,
    collaboration: true,
    presets: [
        UniverDocsCorePreset({ collaboration: true }),
        UniverDocsCollaborationPreset(),
    ],
});
