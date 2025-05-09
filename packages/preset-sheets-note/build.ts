import { build } from '@univerjs-infra/shared/vite';

build({
    umdDeps: [
        '@univerjs/sheets-note',
        '@univerjs/sheets-note-ui',
    ],
});
