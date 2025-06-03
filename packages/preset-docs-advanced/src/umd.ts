import type { IUniverEngineFormulaConfig } from '@univerjs-pro/engine-formula';
import type { IUniverExchangeClientOptions } from '@univerjs-pro/exchange-client';
import type { IPreset } from './types';
import { UniverDocsExchangeClientPlugin } from '@univerjs-pro/docs-exchange-client';
import { UniverDocsPrintPlugin } from '@univerjs-pro/docs-print';
import { UniverExchangeClientPlugin } from '@univerjs-pro/exchange-client';
import { UniverLicensePlugin } from '@univerjs-pro/license';

import '@univerjs-pro/exchange-client/lib/facade';

import '@univerjs-pro/exchange-client/lib/index.css';

export type * from '@univerjs-pro/exchange-client/lib/facade';

export interface IUniverDocsAdvancedPresetConfig {
    universerEndpoint?: string;
    license?: string;
    useWorker?: boolean;
    formula?: Pick<IUniverEngineFormulaConfig, 'function'>;
    exchangeClientOptions?: IUniverExchangeClientOptions;
}

/**
 * This presets helps you to create a Univer Docs with open sourced features.
 */
export function UniverDocsAdvancedPreset(config: Partial<IUniverDocsAdvancedPresetConfig> = {
    license: '',
    universerEndpoint: '',
}): IPreset {
    const {
        license,
        universerEndpoint,
        exchangeClientOptions,
    } = config;

    const serverEndpoint = universerEndpoint ?? `${window.location.protocol}//${window.location.host}`;

    return {
        plugins: [
            [UniverLicensePlugin, { license }],

            UniverDocsPrintPlugin,

            [UniverExchangeClientPlugin, {
                uploadFileServerUrl: `${serverEndpoint}/universer-api/stream/file/upload`,
                getTaskServerUrl: `${serverEndpoint}/universer-api/exchange/task/{taskID}`,
                signUrlServerUrl: `${serverEndpoint}/universer-api/file/{fileID}/sign-url`,
                importServerUrl: `${serverEndpoint}/universer-api/exchange/{type}/import`,
                exportServerUrl: `${serverEndpoint}/universer-api/exchange/{type}/export`,
                downloadEndpointUrl: `${serverEndpoint}/`,
                options: exchangeClientOptions,
            }],
            UniverDocsExchangeClientPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
