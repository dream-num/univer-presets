import type { UniverSheetsAdvancedPreset } from '@univerjs/preset-sheets-advanced';
import type { IPreset } from '../../types';
import { UniverSheetsThreadCommentPlugin } from '@univerjs/sheets-thread-comment';
import { UniverSheetsThreadCommentUIPlugin } from '@univerjs/sheets-thread-comment-ui';
import { UniverCollaborationPlugin } from '@univerjs-pro/collaboration';
import { UniverCollaborationClientPlugin } from '@univerjs-pro/collaboration-client';
import { UniverEditHistoryLoaderPlugin } from '@univerjs-pro/edit-history-loader';
import { UniverThreadCommentDataSourcePlugin } from '@univerjs-pro/thread-comment-datasource';

import '@univerjs/sheets-thread-comment/facade';

export interface IUniverSheetsCollaborationPresetConfig {
    universerEndpoint?: string;
}

/**
 * This preset add collaboration features, including collaboration editing, collaboration cursors,
 * history and comments into your application.
 *
 * To use this plugin, you should import {@link UniverSheetsAdvancedPreset} first.
 */
export function UniverSheetsCollaborationPreset(config: Partial<IUniverSheetsCollaborationPresetConfig> = {}): IPreset {
    const { universerEndpoint } = config;

    const serverEndpoint = universerEndpoint ?? `${window.location.protocol}//${window.location.host}`;

    return {
        plugins: [
            UniverCollaborationPlugin,
            [UniverCollaborationClientPlugin, {
                enableOfflineEditing: true,
                enableSingleActiveInstanceLock: true,
                enableAuthServer: true,
                authzUrl: `${serverEndpoint}/universer-api/authz`,
                snapshotServerUrl: `${serverEndpoint}/universer-api/snapshot`,
                collabSubmitChangesetUrl: `${serverEndpoint}/universer-api/comb`,
                collabWebSocketUrl: `${serverEndpoint}/universer-api/comb/connect`,
                loginUrlKey: `${serverEndpoint}/universer-api/oidc/authpage`,
                uploadFileServerUrl: `${serverEndpoint}/universer-api/stream/file/upload`,
                signUrlServerUrl: `${serverEndpoint}/universer-api/file/{fileID}/sign-url`,
                downloadEndpointUrl: `${serverEndpoint}/`,
                sendChangesetTimeout: 200,
            }],
            [UniverEditHistoryLoaderPlugin, {
                historyListServerUrl: `${serverEndpoint}/universer-api/history`,
            }],

            UniverSheetsThreadCommentPlugin,
            UniverSheetsThreadCommentUIPlugin,
            UniverThreadCommentDataSourcePlugin,
        ],
    };
}
