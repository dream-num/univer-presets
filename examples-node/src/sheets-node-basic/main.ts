import path from 'node:path';
import process from 'node:process';
import { createUniver, LocaleType } from '@univerjs/presets';
import { UniverSheetsNodeCorePreset } from '@univerjs/presets/preset-sheets-node-core';

// From now on, Univer is a full-stack SDK.

async function run(): Promise<void> {
    const workerSrc = path.resolve(__dirname, './worker');

    const { univerAPI } = createUniver({
        locale: LocaleType.ZH_CN,
        locales: {},
        presets: [
            UniverSheetsNodeCorePreset({ workerSrc }),
        ],
    });

    const univerSheet = univerAPI.createWorkbook({});

    const a1 = univerSheet.getActiveSheet().getRange('A1');
    await a1.setValue({ v: 123 });

    const b1 = univerSheet.getActiveSheet().getRange('B1');
    await b1.setValue({ f: '=SUM(A1) * 6' });

    await awaitTime(500);

    // eslint-disable-next-line no-console
    console.log('Debug, formula value', b1.getCellData()?.v);

    // eslint-disable-next-line no-console
    console.log(univerSheet.save());

    process.exit(0);
}

function awaitTime(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

run();
