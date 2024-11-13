import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs-pro/collaboration',
        '@univerjs-pro/collaboration-client',
    ],
});
