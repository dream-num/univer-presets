import type { IPreset } from '../../types';

import { UniverSheetsHyperLinkPlugin } from '@univerjs/sheets-hyper-link';
import { UniverSheetsHyperLinkUIPlugin } from '@univerjs/sheets-hyper-link-ui';

export function UniverSheetsSortPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsHyperLinkPlugin,
            UniverSheetsHyperLinkUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
