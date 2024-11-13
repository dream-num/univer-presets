import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs-pro/license',
        '@univerjs/network',
        '@univerjs-pro/exchange-client',
        '@univerjs-pro/sheets-exchange-client',
        '@univerjs-pro/sheets-pivot',
        '@univerjs-pro/sheets-pivot-ui',
        '@univerjs-pro/sheets-print',
    ],
});
