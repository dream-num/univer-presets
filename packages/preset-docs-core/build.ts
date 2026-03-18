import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/design',
        '@univerjs/ui',
        '@univerjs/docs',
        '@univerjs/docs-ui',
    ],
});
