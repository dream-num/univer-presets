import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/sheets-conditional-formatting',
        '@univerjs/sheets-conditional-formatting-ui',
    ],
});
