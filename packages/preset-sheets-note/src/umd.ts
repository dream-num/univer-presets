import type { IPreset } from './types';

import { UniverSheetsNotePlugin } from '@univerjs/sheets-note';
import { UniverSheetsNoteUIPlugin } from '@univerjs/sheets-note-ui';

import '@univerjs/sheets-note-ui/lib/index.css';

export * from '@univerjs/sheets-note/facade';

export function UniverDocsHyperLinkPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsNotePlugin,
            UniverSheetsNoteUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
