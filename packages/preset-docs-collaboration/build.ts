import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs-pro/collaboration-client',
        '@univerjs-pro/collaboration-client-ui',
    ],
});
