import type { IPreset } from '../../types';

import { UniverSheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui';

export function UniverSheetsFilterPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsConditionalFormattingPlugin,
            UniverSheetsConditionalFormattingUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
