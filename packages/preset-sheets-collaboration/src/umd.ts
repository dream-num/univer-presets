import type { IPreset } from './types';
import { UniverCollaborationPlugin } from '@univerjs-pro/collaboration';
import { UniverCollaborationClientPlugin } from '@univerjs-pro/collaboration-client';
import { BrowserCollaborationSocketService, UniverCollaborationClientUIPlugin } from '@univerjs-pro/collaboration-client-ui';
import { UniverEditHistoryLoaderPlugin } from '@univerjs-pro/edit-history-loader';

import '@univerjs-pro/collaboration-client-ui/lib/index.css';
import '@univerjs-pro/edit-history-viewer/lib/index.css';

import '@univerjs-pro/collaboration-client/lib/facade';
import '@univerjs-pro/collaboration-client-ui/lib/facade';

export type * from '@univerjs-pro/collaboration-client-ui/lib/facade';
export type * from '@univerjs-pro/collaboration-client/lib/facade';

export interface IUniverSheetsCollaborationPresetConfig {
    universerEndpoint?: string;
    /**
     * The container id of the history list, which is used to load the history list. same as the container id of the univer.
     */
    univerContainerId?: string;

    /**
     * Enable offline editing, which allows users to edit the document when they are offline.
     * The changes will be synced when the user is back online.
     * @default true
     */
    enableOfflineEditing?: boolean;

    /**
     * Enable single active instance lock, which prevents multiple users from editing the same document at the same time.
     * This is useful for preventing conflicts when multiple users are editing the same document.
     * @default true
     */
    enableSingleActiveInstanceLock?: boolean;
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
    const {
        universerEndpoint,
        univerContainerId = 'app',
        enableOfflineEditing = true,
        enableSingleActiveInstanceLock = true,
    } = config;

    const serverEndpoint = universerEndpoint ?? `${window.location.protocol}//${window.location.host}`;

    return {
        plugins: [
            UniverCollaborationPlugin,
            [UniverCollaborationClientPlugin, {
                socketService: BrowserCollaborationSocketService,
                enableOfflineEditing,
                enableSingleActiveInstanceLock,
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
            [UniverCollaborationClientUIPlugin, {}],
            [UniverEditHistoryLoaderPlugin, {
                univerContainerId,
                historyListServerUrl: `${serverEndpoint}/universer-api/history`,
            }],
        ],
    };
}
