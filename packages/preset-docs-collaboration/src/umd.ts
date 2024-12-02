import type { IPreset } from './types';
import { UniverCollaborationPlugin } from '@univerjs-pro/collaboration';
import { UniverCollaborationClientPlugin } from '@univerjs-pro/collaboration-client';

import '@univerjs-pro/collaboration-client/lib/index.css';

export interface IUniverDocsCollaborationPresetConfig {
    universerEndpoint?: string;
}

function transformUrlProtocolToWs(url: string) {
    const wsUrl = new URL(url, window.location.origin);
    switch (wsUrl.protocol) {
        case 'https:':
            wsUrl.protocol = 'wss:';
            break;
        case 'http:':
            wsUrl.protocol = 'ws:';
            break;
    }
    return wsUrl.toString();
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
                collabWebSocketUrl: transformUrlProtocolToWs(`${serverEndpoint}/universer-api/comb/connect`),
                loginUrlKey: `${serverEndpoint}/universer-api/oidc/authpage`,
                uploadFileServerUrl: `${serverEndpoint}/universer-api/stream/file/upload`,
                signUrlServerUrl: `${serverEndpoint}/universer-api/file/{fileID}/sign-url`,
                downloadEndpointUrl: `${serverEndpoint}/`,
                sendChangesetTimeout: 200,
            }],
        ],
    };
}
