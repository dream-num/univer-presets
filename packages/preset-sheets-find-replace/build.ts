import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/find-replace',
        '@univerjs/sheets-find-replace',
    ],
});
