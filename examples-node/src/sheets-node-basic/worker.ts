import { createUniver, LocaleType } from '@univerjs/presets';
import { UniverSheetsNodeCoreWorkerPreset } from '@univerjs/presets/preset-sheets-node-core/web-worker';

createUniver({
    locale: LocaleType.ZH_CN,
    presets: [
        UniverSheetsNodeCoreWorkerPreset(),
    ],
});
