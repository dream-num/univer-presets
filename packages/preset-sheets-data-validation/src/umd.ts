import type { IUniverSheetsDataValidationUIConfig } from '@univerjs/sheets-data-validation-ui';
import type { IPreset } from './types';
import { UniverDataValidationPlugin } from '@univerjs/data-validation';
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsDataValidationUIPlugin } from '@univerjs/sheets-data-validation-ui';

import '@univerjs/sheets-data-validation/facade';

import '@univerjs/sheets-data-validation-ui/lib/index.css';

export type * from '@univerjs/sheets-data-validation/facade';

export interface IUniverSheetsDataValidationPresetConfig extends
    Pick<IUniverSheetsDataValidationUIConfig, 'showEditOnDropdown'> {
}

export function UniverSheetsDataValidationPreset(config: Partial<IUniverSheetsDataValidationPresetConfig> = {}): IPreset {
    const { showEditOnDropdown } = config;

    return {
        plugins: [
            UniverDataValidationPlugin,
            UniverSheetsDataValidationPlugin,
            [UniverSheetsDataValidationUIPlugin, {
                showEditOnDropdown,
            }],
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
