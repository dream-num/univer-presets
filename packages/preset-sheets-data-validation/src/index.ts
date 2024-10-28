import type { IPreset } from '../../types';

import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsDataValidationUIPlugin } from '@univerjs/sheets-data-validation-ui';

import '@univerjs/sheets-data-validation/facade';

export function UniverSheetsFilterPreset(): IPreset {
    return {
        plugins: [
            UniverSheetsDataValidationPlugin,
            UniverSheetsDataValidationUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
