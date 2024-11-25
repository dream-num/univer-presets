import { build } from '@univerjs-infra/shared/vite';

build({
    mode: 'bootstrap',
    umdDeps: [
        '@univerjs/protocol',
        '@univerjs/core',
        '@univerjs/telemetry',
        '@univerjs/rpc',
        '@univerjs/design',
        '@univerjs/engine-render',
        '@univerjs/engine-numfmt',
        '@univerjs/engine-formula',
        '@univerjs/drawing',
    ],
});
