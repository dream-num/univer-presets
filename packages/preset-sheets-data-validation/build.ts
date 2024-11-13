import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/data-validation',
        '@univerjs/sheets-data-validation',
        '@univerjs/sheets-data-validation-ui',
    ],
});
