import process from 'node:process';
import { awaitTime, FUniver, LocaleType, LogLevel } from '@univerjs/core';
import { createUniver } from '@univerjs/presets';
import { UniverSheetsNodeBasicPreset } from '@univerjs/presets/sheets-node/sheets-node-basic/index';
import { zhCN } from '@univerjs/presets/sheets-node/sheets-node-basic/zh-CN';

// From now on, Univer is a full-stack SDK.

async function run(): Promise<void> {
    const { univerAPI } = createUniver({
        logLevel: LogLevel.INFO,
        locale: LocaleType.ZH_CN,
        presets: [
            UniverSheetsNodeBasicPreset({ locales: { zhCN }, workerSrc: './worker.js' }),
        ],
    });

    const univerSheet = univerAPI.createUniverSheet({});

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

run();
