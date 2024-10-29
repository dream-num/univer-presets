import type { IPreset } from '../../types';
import { UniverSheetsThreadCommentPlugin } from '@univerjs/sheets-thread-comment';
import { UniverSheetsThreadCommentUIPlugin } from '@univerjs/sheets-thread-comment-ui';
import { UniverThreadCommentDataSourcePlugin } from '@univerjs-pro/thread-comment-datasource';

import '@univerjs/sheets-thread-comment/facade';

export interface IUniverSheetsThreadCommentPresetConfig {
    /**
     * If you would like to use comment with Univer's first-party collaboration features,
     * please set this option to `true`.
     */
    collaboration?: boolean;
}

/**
 * This preset add thread comment features into your application.
 *
 * @param {Partial<IUniverSheetsThreadCommentPresetConfig>} config - The configuration object.
 */
export function UniverSheetsThreadCommentPreset(config: Partial<IUniverSheetsThreadCommentPresetConfig> = {}): IPreset {
    const { collaboration } = config;

    const plugins: IPreset['plugins'] = [
        UniverSheetsThreadCommentPlugin,
        UniverSheetsThreadCommentUIPlugin,
    ];

    if (collaboration) {
        plugins.push(UniverThreadCommentDataSourcePlugin);
    }

    return { plugins };
}
