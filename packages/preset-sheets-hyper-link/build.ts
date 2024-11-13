import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/sheets-hyper-link',
        '@univerjs/sheets-hyper-link-ui',
    ],
});
