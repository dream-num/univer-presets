import type { IUniverConfig } from '@univerjs/core';
import type { IPreset } from '../../../type';
import { UniverExchangeClientPlugin } from '@univerjs-pro/exchange-client';
import { UniverLicensePlugin } from '@univerjs-pro/license';
import { UniverSheetsExchangeClientPlugin } from '@univerjs-pro/sheets-exchange-client';
import { UniverSheetsPivotTablePlugin } from '@univerjs-pro/sheets-pivot';
import { UniverSheetsPivotTableUIPlugin } from '@univerjs-pro/sheets-pivot-ui';
import { UniverSheetsPrintPlugin } from '@univerjs-pro/sheets-print';

export interface IUniverSheetsAdvancedPresetConfig {
    universerEndpoint?: string;
    locales?: IUniverConfig['locales'];
    license?: string;
}

/**
 * This preset add advanced features into your Univer application.
 */
export function UniverSheetsAdvancedPreset(config: Partial<IUniverSheetsAdvancedPresetConfig> = {
    license: '',
    universerEndpoint: ``,
}): IPreset {
    const {
        locales,
        license,
        universerEndpoint,
    } = config;

    const serverEndpoint = universerEndpoint ?? `${window.location.protocol}//${window.location.host}`;

    return {
        locales,
        plugins: [
            [UniverLicensePlugin, { license }],
            UniverSheetsPivotTablePlugin,
            UniverSheetsPivotTableUIPlugin,
            UniverSheetsPrintPlugin,
            [UniverExchangeClientPlugin, {
                uploadFileServerUrl: `${serverEndpoint}/universer-api/stream/file/upload`,
                getTaskServerUrl: `${serverEndpoint}/universer-api/exchange/task/{taskID}`,
                signUrlServerUrl: `${serverEndpoint}/universer-api/file/{fileID}/sign-url`,
                importServerUrl: `${serverEndpoint}/universer-api/exchange/{type}/import`,
                exportServerUrl: `${serverEndpoint}/universer-api/exchange/{type}/export`,
                downloadEndpointUrl: `${serverEndpoint}/`,
            }],
            UniverSheetsExchangeClientPlugin,
        ],
    };
}
