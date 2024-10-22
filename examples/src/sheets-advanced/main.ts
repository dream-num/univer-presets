import { createUniver, defaultTheme, LocaleType } from '@univerjs/presets';
import { UniverSheetsAdvancedPreset } from '@univerjs/presets/sheets/sheets-advanced-features/index';
import { zhCN as advancedZhCN } from '@univerjs/presets/sheets/sheets-advanced-features/zh-CN';
import { UniverSheetsBasicPreset } from '@univerjs/presets/sheets/sheets-basic/index';
import { zhCN as basicZhCN } from '@univerjs/presets/sheets/sheets-basic/zh-CN';

const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    presets: [
        UniverSheetsBasicPreset({ locales: { zhCN: basicZhCN } }),
        UniverSheetsAdvancedPreset({ locales: { zhCN: advancedZhCN }, universerEndpoint: 'https://dev.univer.plus' }),
    ],
});

univerAPI.createUniverSheet({ name: 'Test Sheet' });
