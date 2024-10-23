import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';
import { zhCN as basicZhCN } from '@univerjs/presets/docs/docs-basic/zh-CN';
import { UniverDocsCollaborationPreset } from '@univerjs/presets/docs/docs-collaboration/index';
import { zhCN as collaborationZhCH } from '@univerjs/presets/docs/docs-collaboration/zh-CN';
import { UniverDocsBasicPreset } from '@univerjs/presets/presets/docs/docs-basic/index.js';

createUniver({
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    collaboration: true,
    presets: [
        UniverDocsBasicPreset({ locales: { zhCN: basicZhCN }, collaboration: true }),
        UniverDocsCollaborationPreset({ locales: { zhCN: collaborationZhCH } }),
    ],
});
