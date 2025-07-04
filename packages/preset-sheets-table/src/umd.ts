import type { IPreset } from './types';

import { UniverSheetsTablePlugin } from '@univerjs/sheets-table';
import { UniverSheetsTableUIPlugin } from '@univerjs/sheets-table-ui';

import '@univerjs/sheets-table/lib/facade';

import '@univerjs/sheets-table-ui/lib/index.css';

export type * from '@univerjs/sheets-table/lib/facade';

export function UniverSheetsTablePreset(): IPreset {
    return {
        plugins: [
            UniverSheetsTablePlugin,
            UniverSheetsTableUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
