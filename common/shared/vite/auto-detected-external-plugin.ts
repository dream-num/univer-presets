import type { Plugin } from 'vite';
import { convertLibNameFromPackageName } from './utils';

const peerDepsMap = {
    'react': {
        global: 'React',
        name: 'react',
        version: '>=16.9.0 || >=17 || >=18 || >=19',
    },
    'react/jsx-runtime': {
        global: 'React',
        name: 'react',
        version: 'react',
    },
    'react-dom': {
        global: 'ReactDOM',
        name: 'react-dom',
        version: '>=16.9.0 || >=17 || >=18 || >=19',
    },
    'react-dom/client': {
        global: 'ReactDOM',
        name: 'react-dom',
        version: 'react-dom',
    },
    'rxjs': {
        global: 'rxjs',
        name: 'rxjs',
        version: '>=7.0.0',
    },
    'rxjs/operators': {
        global: 'rxjs.operators',
        name: 'rxjs',
        version: 'rxjs',
    },
    '@wendellhu/redi': {
        global: '@wendellhu/redi',
        name: '@wendellhu/redi',
        version: '0.19.2',
    },
    '@wendellhu/redi/react-bindings': {
        global: '@wendellhu/redi/react-bindings',
        name: '@wendellhu/redi',
        version: '@wendellhu/redi',
    },
    'vue': {
        global: 'Vue',
        name: 'vue',
        version: '>=3.0.0',
        optional: true,
    },
};

export function autoDetectedExternalPlugin(): Plugin {
    const globals = {};
    let hasCss = false;

    return {
        name: 'auto-detected-external',
        enforce: 'pre',
        apply: 'build',

        resolveId(source) {
            if (source.endsWith('.less') || source.endsWith('.css')) {
                hasCss = true;
                return null;
            }

            if (source in peerDepsMap) {
                globals[source] = peerDepsMap[source].global;

                return { id: source, external: true };
            }
            else if (source.startsWith('@univerjs')) {
                if (source === '@univerjs/icons') {
                    return null;
                }
                if (source === '@univerjs/protocol') {
                    return null;
                }

                globals[source] = convertLibNameFromPackageName(source);

                return { id: source, external: true };
            }

            return null;
        },

        outputOptions(opts) {
            opts.globals = globals;

            if (hasCss) {
                opts.assetFileNames = 'index.css';
            }

            return opts;
        },
    };
};
