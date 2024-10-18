import type { IUniverConfig } from '@univerjs/core';
import type { IPreset } from '../../../type';
import { UniverNetworkPlugin } from '@univerjs/network';
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
    useWorker?: boolean;
}

// TODO: @jikkai we need to add univer-pro FACADE API here

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
        useWorker,
    } = config;

    const serverEndpoint = universerEndpoint ?? `${window.location.protocol}//${window.location.host}`;

    return {
        locales,
        plugins: [
            UniverNetworkPlugin,
            [UniverLicensePlugin, { license }],

            // TODO: @wzhudev: if we use worker, we need to add different configurations to SheetsPivotTable
            [UniverSheetsPivotTablePlugin, { notExecuteFormula: useWorker ?? undefined }],
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
