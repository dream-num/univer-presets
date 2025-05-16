import type { IPreset } from './types';
import { UniverFindReplacePlugin } from '@univerjs/find-replace';
import { UniverSheetsFindReplacePlugin } from '@univerjs/sheets-find-replace';

import '@univerjs/sheets-find-replace/lib/facade';

import '@univerjs/find-replace/lib/index.css';

export type * from '@univerjs/sheets-find-replace/lib/facade';

export interface IUniverSheetsFindReplacePresetConfig {}

export function UniverSheetsFindReplacePreset(_config: Partial<IUniverSheetsFindReplacePresetConfig> = {}): IPreset {
    return {
        plugins: [
            [UniverFindReplacePlugin],
            [UniverSheetsFindReplacePlugin],
        ].filter(v => !!v) as IPreset['plugins'],
    };
}
