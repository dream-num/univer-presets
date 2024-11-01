import type { IPreset } from './types';

import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverSheetsFilterUIPlugin } from '@univerjs/sheets-filter-ui';

import '@univerjs/sheets-filter/facade';

import '@univerjs/sheets-filter-ui/lib/index.css';

export function UniverSheetsFilterPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsFilterPlugin,
            UniverSheetsFilterUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
