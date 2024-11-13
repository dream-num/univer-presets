import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/docs',
        '@univerjs/rpc-node',
        '@univerjs/sheets',
        '@univerjs/sheets-numfmt',
        '@univerjs/sheets-data-validation',
        '@univerjs/sheets-drawing',
        '@univerjs/sheets-filter',
        '@univerjs/sheets-formula',
        '@univerjs/sheets-hyper-link',
        '@univerjs/sheets-sort',
        '@univerjs/thread-comment',
        '@univerjs/sheets-thread-comment',
    ],
});
