import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';
import { UniverSheetsBasicPreset } from '@univerjs/presets/sheets/sheets-basic/index';
import { zhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    presets: [
        UniverSheetsBasicPreset({ locales: { zhCN } }),
    ],
});

univerAPI.createUniverSheet({ name: 'Test Sheet' });
