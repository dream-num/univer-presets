import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/docs-hyper-link',
        '@univerjs/docs-hyper-link-ui',
    ],
});
