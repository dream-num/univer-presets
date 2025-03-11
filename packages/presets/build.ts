import path from 'node:path';
import { build } from '@univerjs-infra/shared/vite';

build({
    mode: 'bootstrap',
    umdDeps: [
        '@univerjs/protocol',
        '@univerjs/core',
        '@univerjs/network',
        '@univerjs/telemetry',
        '@univerjs/rpc',
        '@univerjs/design',
        '@univerjs/engine-render',
        '@univerjs/engine-numfmt',
        '@univerjs/engine-formula',
        '@univerjs/drawing',
    ],
    umdAdditionalFiles: [
        path.resolve(__dirname, './node_modules/@univerjs-infra/shared/react-polyfill/react-polyfill.js'),
        path.resolve(__dirname, './node_modules/@wendellhu/redi/dist/redi.js'),
        path.resolve(__dirname, './node_modules/@wendellhu/redi/dist/react-bindings.js'),
    ],
});
