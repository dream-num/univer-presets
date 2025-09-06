import type { IUniverEngineFormulaConfig } from '@univerjs-pro/engine-formula';
import type { IUniverExchangeClientOptions } from '@univerjs-pro/exchange-client';
import type { IUniverSheetsPrintConfig } from '@univerjs-pro/sheets-print';
import type { IPreset } from './types';
import { UniverProFormulaEnginePlugin } from '@univerjs-pro/engine-formula';
import { UniverExchangeClientPlugin } from '@univerjs-pro/exchange-client';
import { UniverLicensePlugin } from '@univerjs-pro/license';
import { UniverSheetsChartPlugin } from '@univerjs-pro/sheets-chart';
import { UniverSheetsChartUIPlugin } from '@univerjs-pro/sheets-chart-ui';
import { UniverSheetsExchangeClientPlugin } from '@univerjs-pro/sheets-exchange-client';
import { UniverSheetsPivotTablePlugin } from '@univerjs-pro/sheets-pivot';
import { UniverSheetsPivotTableUIPlugin } from '@univerjs-pro/sheets-pivot-ui';
import { UniverSheetsPrintPlugin } from '@univerjs-pro/sheets-print';
import { UniverSheetSparklinePlugin } from '@univerjs-pro/sheets-sparkline';
import { UniverSheetSparklineUIPlugin } from '@univerjs-pro/sheets-sparkline-ui';

import '@univerjs-pro/exchange-client/lib/facade';
import '@univerjs-pro/sheets-pivot/lib/facade';
import '@univerjs-pro/engine-formula/lib/facade';
import '@univerjs-pro/sheets-print/lib/facade';
import '@univerjs-pro/sheets-chart-ui/lib/facade';
import '@univerjs-pro/sheets-sparkline/lib/facade';

import '@univerjs-pro/exchange-client/lib/index.css';
import '@univerjs-pro/sheets-pivot-ui/lib/index.css';
import '@univerjs-pro/sheets-print/lib/index.css';
import '@univerjs-pro/sheets-chart-ui/lib/index.css';
import '@univerjs-pro/sheets-sparkline-ui/lib/index.css';

export type * from '@univerjs-pro/engine-formula/lib/facade';
export type * from '@univerjs-pro/exchange-client/lib/facade';
export type * from '@univerjs-pro/sheets-chart-ui/lib/facade';
export type * from '@univerjs-pro/sheets-pivot/lib/facade';
export type * from '@univerjs-pro/sheets-print/lib/facade';
export type * from '@univerjs-pro/sheets-sparkline/lib/facade';

export interface IUniverSheetsAdvancedPresetConfig {
    universerEndpoint?: string;
    license?: string;
    useWorker?: boolean;
    formula?: Pick<IUniverEngineFormulaConfig, 'function'>;
    exchangeClientOptions?: IUniverExchangeClientOptions;
    print?: Partial<IUniverSheetsPrintConfig>;
}

/**
 * This presets helps you to create a Univer sheet with open sourced features.
 */
export function UniverSheetsAdvancedPreset(config: Partial<IUniverSheetsAdvancedPresetConfig> = {
    license: '',
    universerEndpoint: '',
}): IPreset {
    const {
        license,
        universerEndpoint,
        useWorker,
        formula,
        exchangeClientOptions,
        print,
    } = config;

    const serverEndpoint = universerEndpoint ?? `${window.location.protocol}//${window.location.host}`;

    return {
        plugins: [
            [UniverLicensePlugin, { license }],

            // TODO: @wzhudev: if we use worker, we need to add different configurations to SheetsPivotTable
            useWorker
                ? [UniverSheetsPivotTablePlugin, { notExecuteFormula: true }]
                : [UniverSheetsPivotTablePlugin],
            UniverSheetsPivotTableUIPlugin,

            [UniverProFormulaEnginePlugin, {
                notExecuteFormula: useWorker,
                function: formula?.function,
            }],

            [UniverSheetsPrintPlugin, {
                enforceWatermark: print?.enforceWatermark,
            }],

            UniverSheetsChartPlugin,
            UniverSheetsChartUIPlugin,

            UniverSheetSparklinePlugin,
            UniverSheetSparklineUIPlugin,

            [UniverExchangeClientPlugin, {
                uploadFileServerUrl: `${serverEndpoint}/universer-api/stream/file/upload`,
                getTaskServerUrl: `${serverEndpoint}/universer-api/exchange/task/{taskID}`,
                signUrlServerUrl: `${serverEndpoint}/universer-api/file/{fileID}/sign-url`,
                importServerUrl: `${serverEndpoint}/universer-api/exchange/{type}/import`,
                exportServerUrl: `${serverEndpoint}/universer-api/exchange/{type}/export`,
                downloadEndpointUrl: `${serverEndpoint}/`,
                options: exchangeClientOptions,
            }],
            UniverSheetsExchangeClientPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
