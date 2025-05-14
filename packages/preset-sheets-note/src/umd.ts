import type { IPreset } from './types';

import { UniverSheetsNotePlugin } from '@univerjs/sheets-note';
import { UniverSheetsNoteUIPlugin } from '@univerjs/sheets-note-ui';

import '@univerjs/sheets-note/facade';

import '@univerjs/sheets-note-ui/lib/index.css';

export type * from '@univerjs/sheets-note/facade';

export function UniverSheetsNotePreset(): IPreset {
    return {
        plugins: [
            UniverSheetsNotePlugin,
            UniverSheetsNoteUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
