import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/docs',
        '@univerjs/rpc-node',
        '@univerjs/docs-hyper-link',
        '@univerjs/thread-comment',
    ],
});
