import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/sheets-filter',
        '@univerjs/sheets-filter-ui',
    ],
});
