import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';
import { zhCN } from '@univerjs/presets/docs/docs-basic/zh-CN';
import { UniverDocsBasicPreset } from '@univerjs/presets/presets/docs/docs-basic/index.js';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    presets: [
        UniverDocsBasicPreset({ locales: { zhCN } }),
    ],
});

univerAPI.createUniverDoc({});
