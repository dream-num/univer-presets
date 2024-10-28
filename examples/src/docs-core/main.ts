import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';
import { UniverDocsCorePreset } from '@univerjs/presets/preset-docs-core';
import zhCN from '@univerjs/presets/preset-docs-core/locales/zh-CN';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
        zhCN,
    },
    theme: defaultTheme,
    presets: [
        UniverDocsCorePreset(),
    ],
});

univerAPI.createUniverDoc({});
