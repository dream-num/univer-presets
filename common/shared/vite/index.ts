import type { InlineConfig } from 'vite';
import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';
import { mergeConfig, build as viteBuild } from 'vite';
import dts from 'vite-plugin-dts';
import vitePluginExternal from 'vite-plugin-external';

import { autoDetectedExternalPlugin } from './auto-detected-external-plugin';
import prependUMDRaw from './prepend-umd-raw';

import { convertLibNameFromPackageName } from './utils';

type BuildMode = 'bootstrap';

interface IBuildExecuterOptions {
    pkg: Record<string, any>;
    entry: Record<string, string>;
    umdDeps: string[];
    umdAdditionalFiles: string[];
}

const clone = (data: any) => JSON.parse(JSON.stringify(data));

function getSharedConfig(): InlineConfig {
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
    return sharedConfig;
}

async function buildESM(sharedConfig: InlineConfig, options: IBuildExecuterOptions) {
    const { entry } = options;

    await Promise.all(Object.keys(entry).map((key) => {
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

    const __dirname = process.cwd();
    const libDir = path.resolve(__dirname, 'lib');
    const esmDir = path.resolve(__dirname, 'lib/es');

    fs.copySync(esmDir, libDir);
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
    const { pkg, entry, umdDeps, umdAdditionalFiles } = options;

    const __dirname = process.cwd();
    entry.index = path.resolve(__dirname, 'src/umd.ts');

    await Promise.all(Object.keys(entry).map((key) => {
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
        });

        return viteBuild(config);
    }));

    prependUMDRaw({
        umdDeps,
        umdAdditionalFiles,
    });

    return Promise.resolve();
}

interface IBuildOptions {
    mode?: BuildMode;
    umdDeps?: string[];
    umdAdditionalFiles?: string[];
}

export async function build(options?: IBuildOptions) {
    const { mode, umdDeps = [], umdAdditionalFiles = [] } = options ?? {};

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

    const hasWorker = fs.existsSync(path.resolve(__dirname, 'src/worker.ts'));
    if (hasWorker) {
        entry.worker = path.resolve(__dirname, 'src/worker.ts');
    }

    const buildExecuterOptions: IBuildExecuterOptions = {
        pkg,
        entry,
        umdDeps,
        umdAdditionalFiles,
    };

    buildUMD(getSharedConfig(), clone(buildExecuterOptions));

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

            if (fs.existsSync(path.resolve(__presetDir, 'worker.ts'))) {
                entry[`${preset}/worker`] = path.resolve(__presetDir, 'worker.ts');
            }

            const __cssFile = path.resolve(__dirname, 'node_modules', `@univerjs/${preset}`, 'lib/index.css');
            const __cssOutputDir = path.resolve(__dirname, 'lib', 'styles');
            fs.ensureDirSync(__cssOutputDir);
            if (fs.existsSync(__cssFile)) {
                fs.copyFileSync(__cssFile, path.resolve(__cssOutputDir, `${preset}.css`));
            }
        }
    }

    buildESM(getSharedConfig(), clone(buildExecuterOptions));
    buildCJS(getSharedConfig(), clone(buildExecuterOptions));
}
