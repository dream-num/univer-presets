import type { IPreset } from './types';
import { UniverCollaborationPlugin } from '@univerjs-pro/collaboration';
import { UniverCollaborationClientPlugin } from '@univerjs-pro/collaboration-client';
import { UniverEditHistoryLoaderPlugin } from '@univerjs-pro/edit-history-loader';

import '@univerjs-pro/collaboration-client/lib/index.css';
import '@univerjs-pro/edit-history-viewer/lib/index.css';

export interface IUniverSheetsCollaborationPresetConfig {
    universerEndpoint?: string;
    /**
     * The container id of the history list, which is used to load the history list. same as the container id of the univer.
     */
    univerContainerId?: string;
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

/**
 * This preset add collaboration features, including collaboration editing, collaboration cursors,
 * and history into your application.
 * To use this plugin, you should import {@link UniverSheetsAdvancedPreset} first.
 *
 * @param {Partial<IUniverSheetsCollaborationPresetConfig>} config - The configuration object.
 */
export function UniverSheetsCollaborationPreset(config: Partial<IUniverSheetsCollaborationPresetConfig> = {}): IPreset {
    const { universerEndpoint, univerContainerId } = config;

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
                wsSessionTicketUrl: `${serverEndpoint}/universer-api/user/session-ticket`,
                sendChangesetTimeout: 200,
            }],
            [UniverEditHistoryLoaderPlugin, {
                univerContainerId,
                historyListServerUrl: `${serverEndpoint}/universer-api/history`,
            }],
        ],
    };
}