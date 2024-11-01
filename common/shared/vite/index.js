/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('node:path');
const process = require('node:process');
const fs = require('fs-extra');
const { default: dts } = require('vite-plugin-dts');
const vitePluginExternal = require('vite-plugin-external');
const { defineConfig, mergeConfig } = require('vitest/config');

const { autoExternalizeDependency } = require('./auto-externalize-dependency-plugin');
const { buildPkg } = require('./build-pkg');
const { buildUMD } = require('./build-umd');
const { convertLibNameFromPackageName } = require('./utils');

/**
 * IOptions
 * @typedef {object} IOptions - options of shared vite config
 * @property {string} mode - mode of vite
 * @property {object} pkg - package.json
 */

function createViteConfig(overrideConfig, /** @type {IOptions} */ options) {
    const { mode, pkg } = options;

    const dirname = process.cwd();

    /** @type {import('vite').UserConfig} */
    const originalConfig = {
        esbuild: {},
        build: {
            emptyOutDir: false,
            target: 'chrome70',
            outDir: 'lib',
            lib: {
                entry: {
                    index: path.resolve(dirname, 'src/index.ts'),
                },
                name: convertLibNameFromPackageName(pkg.name),
                fileName: (format, entryName) => {
                    if (entryName.startsWith('locales/')) {
                        return `${entryName}.js`;
                    }
                    else {
                        return `${format}/${entryName}.js`;
                    }
                },
                formats: ['es'],
            },
        },
        plugins: [
            autoExternalizeDependency({
                isUMD: false,
            }),
            vitePluginExternal({
                nodeBuiltins: true, // exclude Node.js builtins from bundling
            }),
            dts({
                entryRoot: 'src',
                outDir: 'lib/types',
                clearPureImport: false,
            }),
            buildPkg(),
            buildUMD(),
        ],
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
            'process.env.BUILD_TIMESTAMP': JSON.stringify(Number.parseInt(Date.now() / 1000)),
        },
    };

    const webWorkerFile = path.resolve(process.cwd(), 'src/web-worker.ts');
    if (fs.existsSync(webWorkerFile)) {
        originalConfig.build.lib.entry['web-worker'] = webWorkerFile;
    }

    const localeDir = path.resolve(process.cwd(), 'src/locales');
    if (fs.existsSync(localeDir)) {
        const locales = fs.readdirSync(localeDir);

        for (const file of locales) {
            if (fs.statSync(path.resolve(localeDir, file)).isDirectory()) {
                continue;
            }
            const localeValue = file.replace('.ts', '');
            originalConfig.build.lib.entry[`locales/${localeValue}`] = path.resolve(localeDir, file);
        }
    }

    return mergeConfig(
        defineConfig(originalConfig),
        overrideConfig,
    );
};

module.exports = createViteConfig;
