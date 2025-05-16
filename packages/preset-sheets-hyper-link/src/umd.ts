import type { IUniverSheetsHyperLinkUIConfig } from '@univerjs/sheets-hyper-link-ui';
import type { IPreset } from './types';
import { UniverSheetsHyperLinkPlugin } from '@univerjs/sheets-hyper-link';
import { UniverSheetsHyperLinkUIPlugin } from '@univerjs/sheets-hyper-link-ui';

import '@univerjs/sheets-hyper-link/lib/facade';
import '@univerjs/sheets-hyper-link-ui/lib/facade';

import '@univerjs/sheets-hyper-link-ui/lib/index.css';

export type * from '@univerjs/sheets-hyper-link-ui/lib/facade';
export type * from '@univerjs/sheets-hyper-link/lib/facade';

export interface IUniverSheetsHyperLinkPresetConfig extends
    Pick<IUniverSheetsHyperLinkUIConfig, 'urlHandler'> {
}

export function UniverSheetsHyperLinkPreset(config: Partial<IUniverSheetsHyperLinkPresetConfig> = {}): IPreset {
    const { urlHandler } = config;

    return {
        plugins: [
            UniverSheetsHyperLinkPlugin,
            [UniverSheetsHyperLinkUIPlugin, {
                urlHandler,
            }],
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
