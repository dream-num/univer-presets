import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/drawing-ui',
        '@univerjs/docs-drawing',
        '@univerjs/docs-drawing-ui',
    ],
});
