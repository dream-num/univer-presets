import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs-pro/license',
        '@univerjs-pro/engine-formula',
        '@univerjs-pro/exchange-client',
        '@univerjs-pro/sheets-exchange-client',
        '@univerjs-pro/engine-pivot',
        '@univerjs-pro/sheets-pivot',
        '@univerjs-pro/sheets-pivot-ui',
        '@univerjs-pro/print',
        '@univerjs-pro/sheets-print',
        '@univerjs-pro/sheets-chart',
        '@univerjs-pro/sheets-chart-ui',
        '@univerjs/sheets-graphics',
        '@univerjs-pro/sheets-sparkline',
        '@univerjs-pro/sheets-sparkline-ui',
    ],
});
