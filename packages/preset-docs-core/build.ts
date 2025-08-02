import { build } from '@univerjs-infra/shared/vite';

build({
    umdAdditionalLocales: [
        '@univerjs/design',
    ],
    umdDeps: [
        '@univerjs/ui',
        '@univerjs/docs',
        '@univerjs/docs-ui',
    ],
});
