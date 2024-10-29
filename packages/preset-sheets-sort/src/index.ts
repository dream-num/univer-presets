import type { IPreset } from '../../types';

import { UniverSheetsSortPlugin } from '@univerjs/sheets-sort';
import { UniverSheetsSortUIPlugin } from '@univerjs/sheets-sort-ui';

export function UniverSheetsSortPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsSortPlugin,
            UniverSheetsSortUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
