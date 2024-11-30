import type { IPreset } from './types';

import { UniverDataValidationPlugin } from '@univerjs/data-validation';
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsDataValidationUIPlugin } from '@univerjs/sheets-data-validation-ui';

import '@univerjs/sheets-data-validation/facade';

import '@univerjs/sheets-data-validation-ui/lib/index.css';

export * from '@univerjs/data-validation';
export * from '@univerjs/sheets-data-validation';
export * from '@univerjs/sheets-data-validation-ui';

export function UniverSheetsDataValidationPreset(): IPreset {
    return {
        plugins: [
            UniverDataValidationPlugin,
            UniverSheetsDataValidationPlugin,
            UniverSheetsDataValidationUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
