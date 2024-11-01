import type { LibraryOptions, UserConfig } from 'vite';

import fs from 'fs-extra';
import { build, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vitePluginExternal from 'vite-plugin-external';
import pkg from './package.json';

function convertLibNameFromPackageName(name) {
    return name
        .replace(/^@univerjs(?:-[^/]+)?\//, 'univer-')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};

const peerDepsMap = {
    'react': {
        global: 'React',
        name: 'react',
        version: '^16.9.0 || ^17.0.0 || ^18.0.0',
    },
    'react-dom': {
        global: 'ReactDOM',
        name: 'react-dom',
        version: '^16.9.0 || ^17.0.0 || ^18.0.0',
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
    'vue': {
        global: 'Vue',
        name: 'vue',
        version: '>=3.0.0',
        optional: true,
    },
};

const config: UserConfig = {
    build: {
        target: 'chrome70',
        outDir: 'lib',
        lib: {
            entry: {},
            fileName: (format, entryName) => {
                return `${format}/${entryName}.js`;
            },
            formats: ['es'],
        },
    },
    plugins: [
        vitePluginExternal({
            nodeBuiltins: true,
        }),
        dts({
            entryRoot: 'src',
            outDir: 'lib/types',
            clearPureImport: false,
        }),
        (() => {
            const externals = new Set();
            const peers = new Set();
            const globals = {};

            return {
                name: 'collect-external',
                enforce: 'pre',
                apply: 'build',
                resolveId(source) {
                    if (source in peerDepsMap) {
                        peers.add(source);
                        globals[source] = peerDepsMap[source].global;

                        return { id: source, external: true };
                    }
                    else if (source.startsWith('@univerjs')) {
                        externals.add(source);

                        globals[source] = convertLibNameFromPackageName(source);

                        return { id: source, external: true };
                    }

                    return null;
                },

                outputOptions(opts) {
                    opts.globals = globals;

                    return opts;
                },
            };
        })(),
        (() => {
            return {
                name: 'collect-css',
                enforce: 'post',
                apply: 'build',
                generateBundle() {
                    fs.readdirSync('../').forEach((file) => {
                        const stat = fs.statSync(`../${file}`);
                        if (stat.isDirectory() && fs.existsSync(`../${file}/lib/index.css`)) {
                            fs.ensureDirSync('lib/styles');
                            fs.copyFileSync(`../${file}/lib/index.css`, `lib/styles/${file}.css`);
                        }
                    });
                },
            };
        })(),
        (() => {
            return {
                name: 'build-umd',
                enforce: 'post',
                apply: 'build',
                async generateBundle() {
                    await build({
                        configFile: false,
                        build: {
                            target: 'chrome70',
                            outDir: 'lib/umd',
                            lib: {
                                entry: 'src/index.ts',
                                name: convertLibNameFromPackageName(pkg.name),
                                fileName: () => 'index.js',
                                formats: ['umd'],
                            },
                        },
                        plugins: [
                            (() => {
                                const externals = new Set();
                                const peers = new Set();
                                const globals = {};

                                return {
                                    name: 'collect-external',
                                    enforce: 'pre',
                                    apply: 'build',
                                    resolveId(source) {
                                        if (source in peerDepsMap) {
                                            peers.add(source);
                                            globals[source] = peerDepsMap[source].global;

                                            return { id: source, external: true };
                                        }
                                        else if (source.startsWith('@univerjs')) {
                                            externals.add(source);

                                            globals[source] = convertLibNameFromPackageName(source);

                                            return { id: source, external: true };
                                        }

                                        return null;
                                    },

                                    outputOptions(opts) {
                                        opts.globals = globals;

                                        return opts;
                                    },
                                };
                            })(),
                        ],
                    });
                },
            };
        })(),
    ],
};

const entryConfig = fs.readdirSync('src').reduce((acc, file) => {
    const stat = fs.statSync(`src/${file}`);

    if (stat.isFile()) {
        acc[file.replace('.ts', '')] = `src/${file}`;
    }
    else {
        acc[`${file}/index`] = `src/${file}/index.ts`;
    }

    if (stat.isDirectory()) {
        fs.readdirSync(`src/${file}/locales`).forEach((subFile) => {
            acc[`${file}/locales/${subFile.replace('.ts', '')}`] = `src/${file}/locales/${subFile}`;
        });
    }

    return acc;
}, {} as LibraryOptions['entry']);

export default mergeConfig(config, {
    build: {
        lib: {
            entry: entryConfig,
        },
    },
});
