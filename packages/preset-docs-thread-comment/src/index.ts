import type { IPreset } from './types';
import { UniverDocsThreadCommentUIPlugin } from '@univerjs/docs-thread-comment-ui';
import { UniverThreadCommentUIPlugin } from '@univerjs/thread-comment-ui';
import { UniverThreadCommentDataSourcePlugin } from '@univerjs-pro/thread-comment-datasource';

import '@univerjs/thread-comment-ui/lib/index.css';

export * from '@univerjs/docs-thread-comment-ui';
export * from '@univerjs/thread-comment-ui';
export * from '@univerjs-pro/thread-comment-datasource';

export interface IUniverDocsThreadCommentPresetConfig {
    /**
     * If you would like to use comment with Univer's first-party collaboration features,
     * please set this option to `true`.
     */
    collaboration?: boolean;
}

/**
 * This preset add thread comment features into your application.
 *
 * @param {Partial<IUniverDocsThreadCommentPresetConfig>} config - The configuration object.
 */
export function UniverDocsThreadCommentPreset(config: Partial<IUniverDocsThreadCommentPresetConfig> = {}): IPreset {
    const { collaboration } = config;

    const plugins: IPreset['plugins'] = [
        UniverThreadCommentUIPlugin,
        UniverDocsThreadCommentUIPlugin,
    ];

    if (collaboration) {
        plugins.push(UniverThreadCommentDataSourcePlugin);
    }

    return { plugins };
}
