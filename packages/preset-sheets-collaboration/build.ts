import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs-pro/collaboration-client',
        '@univerjs-pro/collaboration-client-ui',
        '@univerjs-pro/thread-comment-datasource',
        '@univerjs-pro/edit-history-viewer',
        '@univerjs-pro/edit-history-loader',
    ],
});
