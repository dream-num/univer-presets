import type { IPreset } from '../../types';
import { UniverFindReplacePlugin } from '@univerjs/find-replace';
import { UniverSheetsFindReplacePlugin } from '@univerjs/sheets-find-replace';

export interface IUniverSheetsFindReplacePresetConfig {}

export function UniverSheetsFindReplacePreset(_config?: Partial<IUniverSheetsFindReplacePresetConfig>): IPreset {
    return {
        plugins: [
            [UniverFindReplacePlugin],
            [UniverSheetsFindReplacePlugin],
        ].filter(v => !!v) as IPreset['plugins'],
    };
}
