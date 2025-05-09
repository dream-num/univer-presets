import type { IPreset } from './types';

import { UniverSheetTablePlugin } from '@univerjs/sheets-table';
import { UniverSheetTableUIPlugin } from '@univerjs/sheets-table-ui';

import '@univerjs/sheets-table-ui/lib/index.css';

export * from '@univerjs/sheets-table/facade';

export function UniverSheetsTablePreset(): IPreset {
    return {
        plugins: [
            UniverSheetTablePlugin,
            UniverSheetTableUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
