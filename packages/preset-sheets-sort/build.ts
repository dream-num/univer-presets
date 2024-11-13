import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/sheets-sort',
        '@univerjs/sheets-sort-ui',
    ],
});
