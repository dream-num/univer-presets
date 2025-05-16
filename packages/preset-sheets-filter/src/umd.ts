import type { IPreset } from './types';

import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverSheetsFilterUIPlugin } from '@univerjs/sheets-filter-ui';

import '@univerjs/sheets-filter/lib/facade';

import '@univerjs/sheets-filter-ui/lib/index.css';

export type * from '@univerjs/sheets-filter/lib/facade';

export function UniverSheetsFilterPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsFilterPlugin,
            UniverSheetsFilterUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
