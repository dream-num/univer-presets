import type { IPreset } from '../../types';
import { UniverDocsThreadCommentUIPlugin } from '@univerjs/docs-thread-comment-ui';
import { UniverCollaborationPlugin } from '@univerjs-pro/collaboration';
import { UniverCollaborationClientPlugin } from '@univerjs-pro/collaboration-client';
import { UniverThreadCommentDataSourcePlugin } from '@univerjs-pro/thread-comment-datasource';

export interface IUniverDocsCollaborationPresetConfig {
    universerEndpoint?: string;
}

export function UniverDocsCollaborationPreset(config: Partial<IUniverDocsCollaborationPresetConfig> = {}): IPreset {
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

            UniverDocsThreadCommentUIPlugin,
            UniverThreadCommentDataSourcePlugin,
        ],
    };
}
