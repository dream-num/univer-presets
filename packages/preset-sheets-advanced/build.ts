import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs-pro/license',
        '@univerjs/network',
        '@univerjs-pro/engine-formula',
        '@univerjs-pro/exchange-client',
        '@univerjs-pro/sheets-exchange-client',
        '@univerjs-pro/sheets-pivot',
        '@univerjs-pro/sheets-pivot-ui',
        '@univerjs-pro/sheets-print',
        '@univerjs-pro/sheets-chart',
        '@univerjs-pro/sheets-chart-ui',
    ],
});
