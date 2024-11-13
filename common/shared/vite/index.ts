import type { InlineConfig } from 'vite';
import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';
import { mergeConfig, build as viteBuild } from 'vite';
import dts from 'vite-plugin-dts';
import vitePluginExternal from 'vite-plugin-external';

import { autoDetectedExternalPlugin } from './auto-detected-external-plugin';
import { prependUMDRawPlugin } from './prepend-umd-raw-plugin';

import { convertLibNameFromPackageName } from './utils';

type BuildMode = 'bootstrap';

interface IBuildExecuterOptions {
    pkg: Record<string, any>;
    entry: Record<string, string>;
    umdDeps: string[];
}

async function buildESM(sharedConfig: InlineConfig, options: IBuildExecuterOptions) {
    const { entry } = options;

    return Promise.all(Object.keys(entry).map((key) => {
        const config: InlineConfig = mergeConfig(sharedConfig, {
            build: {
                emptyOutDir: false,
                outDir: 'lib',
                lib: {
                    entry: {
                        [key]: entry[key],
                    },
                    fileName: () => `es/${key}.js`,
                    formats: ['es'],
                },
                rollupOptions: {
                    output: {
                        inlineDynamicImports: true,
                    },
                },
            },
            plugins: [
                key === 'index'
                    ? dts({
                        entryRoot: 'src',
                        outDir: 'lib/types',
                        clearPureImport: false,
                    })
                    : null,
            ],
        });

        return viteBuild(config);
    }));
}

async function buildCJS(sharedConfig: InlineConfig, options: IBuildExecuterOptions) {
    const { entry } = options;

    return Promise.all(Object.keys(entry).map((key) => {
        const config: InlineConfig = mergeConfig(sharedConfig, {
            build: {
                emptyOutDir: false,
                outDir: 'lib',
                lib: {
                    entry: {
                        [key]: entry[key],
                    },
                    fileName: () => `cjs/${key}.js`,
                    formats: ['cjs'],
                },
            },
        });

        return viteBuild(config);
    }));
}

async function buildUMD(sharedConfig: InlineConfig, options: IBuildExecuterOptions) {
    const { pkg, entry, umdDeps } = options;

    return await Promise.all(Object.keys(entry).map((key) => {
        let name = convertLibNameFromPackageName(pkg.name);

        if (key.includes('locales')) {
            const localeKey = key.split('/')[1];
            name = `${name}${convertLibNameFromPackageName(localeKey)}`;
        }

        const config: InlineConfig = mergeConfig(sharedConfig, {
            build: {
                emptyOutDir: false,
                outDir: 'lib',
                lib: {
                    entry: {
                        [key]: entry[key],
                    },
                    name,
                    fileName: () => `umd/${key}.js`,
                    formats: ['umd'],
                },
            },
            plugins: [
                prependUMDRawPlugin({
                    umdDeps,
                }),
            ],
        });

        return viteBuild(config);
    }));
}

interface IBuildOptions {
    mode?: BuildMode;
    umdDeps?: string[];
}

export async function build(options?: IBuildOptions) {
    const { mode, umdDeps = [] } = options ?? {};

    const __dirname = process.cwd();

    const pkg = fs.readJsonSync(path.resolve(__dirname, 'package.json'));

    const entry: Record<string, string> = {
        index: path.resolve(__dirname, 'src/index.ts'),
    };

    const hasLocales = fs.existsSync(path.resolve(__dirname, 'src/locales'));
    if (hasLocales) {
        const locales = fs.readdirSync(path.resolve(__dirname, 'src/locales'));
        for (const file of locales) {
            if (fs.statSync(path.resolve(__dirname, 'src/locales', file)).isDirectory() || !file.includes('-')) {
                continue;
            }
            const localeValue = file.replace('.ts', '');
            entry[`locales/${localeValue}`] = path.resolve(__dirname, 'src/locales', file);
        }
    }

    const sharedConfig: InlineConfig = {
        configFile: false,
        build: {
            target: 'chrome70',
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.BUILD_TIMESTAMP': JSON.stringify(Math.floor(Date.now() / 1000)),
        },
        css: {
            modules: {
                localsConvention: 'camelCaseOnly',
                generateScopedName: 'univer-[local]',
            },
        },
        plugins: [
            autoDetectedExternalPlugin(),
            vitePluginExternal({
                nodeBuiltins: true,
            }),
        ],
    };

    const buildExecuterOptions: IBuildExecuterOptions = {
        pkg,
        entry,
        umdDeps,
    };

    buildUMD(sharedConfig, buildExecuterOptions);

    if (mode === 'bootstrap') {
        const presets = fs.readdirSync(path.resolve(__dirname, 'src')).filter(dir => dir.startsWith('preset-'));
        for (const preset of presets) {
            const __presetDir = path.resolve(__dirname, 'src', preset);
            entry[`${preset}/index`] = path.resolve(__presetDir, 'index.ts');

            const locales = fs.readdirSync(path.resolve(__presetDir, 'locales'));
            for (const file of locales) {
                const localeValue = file.replace('.ts', '');
                entry[`${preset}/locales/${localeValue}`] = path.resolve(__presetDir, 'locales', file);
            }
        }
    }

    buildESM(sharedConfig, buildExecuterOptions);
    buildCJS(sharedConfig, buildExecuterOptions);
}
