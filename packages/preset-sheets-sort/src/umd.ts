import type { IPreset } from './types';

import { UniverSheetsSortPlugin } from '@univerjs/sheets-sort';
import { UniverSheetsSortUIPlugin } from '@univerjs/sheets-sort-ui';

import '@univerjs/sheets-sort/lib/facade';

import '@univerjs/sheets-sort-ui/lib/index.css';

export type * from '@univerjs/sheets-sort/lib/facade';

export function UniverSheetsSortPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsSortPlugin,
            UniverSheetsSortUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
