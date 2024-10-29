import type { IPreset } from '../../types';

import { UniverSheetsHyperLinkPlugin } from '@univerjs/sheets-hyper-link';
import { UniverSheetsHyperLinkUIPlugin } from '@univerjs/sheets-hyper-link-ui';

export function UniverSheetsHyperLinkPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsHyperLinkPlugin,
            UniverSheetsHyperLinkUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
