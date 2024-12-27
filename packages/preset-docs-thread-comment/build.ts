import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/thread-comment-ui',
        '@univerjs/docs-thread-comment-ui',
    ],
});
