import type { IPreset } from '../../types';
import { UniverDocsThreadCommentUIPlugin } from '@univerjs/docs-thread-comment-ui';
import { UniverThreadCommentDataSourcePlugin } from '@univerjs-pro/thread-comment-datasource';

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
        UniverDocsThreadCommentUIPlugin,
    ];

    if (collaboration) {
        plugins.push(UniverThreadCommentDataSourcePlugin);
    }

    return { plugins };
}
