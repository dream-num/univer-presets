import { LocaleType, LogLevel } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { createUniver } from '@univerjs/presets';
import { univerSheetsBasicPreset } from '@univerjs/presets/sheets';

const { univer } = createUniver({
    logLevel: LogLevel.INFO,
    locale: LocaleType.ZH_CN,
    theme: defaultTheme,
    presets: [
        univerSheetsBasicPreset({}),
    ],
    whenInit: (univer) => {
        univer.registerPlugin();
    },
});
