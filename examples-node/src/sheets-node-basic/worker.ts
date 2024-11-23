import { createUniver, LocaleType } from '@univerjs/presets';
import { UniverSheetsNodeCoreWorkerPreset } from '@univerjs/presets/preset-sheets-node-core/worker';

createUniver({
    locale: LocaleType.ZH_CN,
    presets: [
        UniverSheetsNodeCoreWorkerPreset(),
    ],
});
