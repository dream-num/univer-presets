import { LogLevel } from '@univerjs/core';
import { createUniver } from '@univerjs/presets';
import { univerSheetsBasicPreset, } from '@univerjs/presets/sheets';
import { presetLocaleA, } from '@univerjs/presets/sheets/zh';
import { univerSheetsBasicPreset, presetLocaleA } from '@univerjs/presets/sheets-advanced';

createUniver({
    logLevel: LogLevel.INFO,
    locales: {
        ...presetLocaleA,
        ...presetLocaleB,
    },
    presets: [
        univerSheetsBasicPreset({ locales: }),
    ],
});

