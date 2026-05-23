import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs-pro/license',
        '@univerjs-pro/engine-formula',
        '@univerjs-pro/engine-chart',
        '@univerjs-pro/engine-shape',
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
        '@univerjs-pro/sheets-shape',
        '@univerjs-pro/sheets-shape-ui',
        '@univerjs-pro/sheets-outline',
        '@univerjs-pro/sheets-outline-ui',
        '@univerjs-pro/collaboration',
    ],
});
