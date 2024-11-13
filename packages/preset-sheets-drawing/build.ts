import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/drawing',
        '@univerjs/drawing-ui',
        '@univerjs/sheets-drawing',
        '@univerjs/sheets-drawing-ui',
    ],
});
