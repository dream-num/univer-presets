import { build } from '@univerjs-infra/shared/vite';

build({
    umdAdditionalLocales: [
        '@univerjs/design',
    ],
    umdDeps: [
        '@univerjs/ui',
        '@univerjs/docs',
        '@univerjs/docs-ui',
        '@univerjs/sheets',
        '@univerjs/sheets-ui',
        '@univerjs/sheets-formula',
        '@univerjs/sheets-formula-ui',
        '@univerjs/sheets-numfmt',
        '@univerjs/sheets-numfmt-ui',
    ],
});
