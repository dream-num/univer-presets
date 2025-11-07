import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs-pro/license',
        '@univerjs-pro/collaboration',
        '@univerjs-pro/exchange-client',
        '@univerjs-pro/docs-exchange-client',
        '@univerjs-pro/print',
        '@univerjs-pro/docs-print',
    ],
});
