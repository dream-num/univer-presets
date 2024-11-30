import type { IPreset } from './types';

import { UniverDocsHyperLinkPlugin } from '@univerjs/docs-hyper-link';
import { UniverDocsHyperLinkUIPlugin } from '@univerjs/docs-hyper-link-ui';

import '@univerjs/docs-hyper-link-ui/lib/index.css';

export * from '@univerjs/docs-hyper-link';
export * from '@univerjs/docs-hyper-link-ui';

export function UniverDocsHyperLinkPreset(): IPreset {
    return {
        plugins: [
            UniverDocsHyperLinkPlugin,
            UniverDocsHyperLinkUIPlugin,
        ].filter(v => !!v) as IPreset['plugins'],
    };
};
