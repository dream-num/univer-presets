import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/sheets-thread-comment',
        '@univerjs/thread-comment-ui',
        '@univerjs/sheets-thread-comment-ui',
        '@univerjs-pro/thread-comment-datasource',
    ],
});
