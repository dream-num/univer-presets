import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/sheets-table',
        '@univerjs/sheets-table-ui',
    ],
});
