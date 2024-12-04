import type { IPreset } from './types';

import { UniverSheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui';

import '@univerjs/sheets-conditional-formatting-ui/lib/index.css';

export function UniverSheetsConditionalFormattingPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsConditionalFormattingPlugin,
            UniverSheetsConditionalFormattingUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
