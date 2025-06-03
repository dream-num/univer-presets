import { execSync } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import cleanPlugin from 'esbuild-plugin-clean';
import copyPlugin from 'esbuild-plugin-copy';
import vue from 'esbuild-plugin-vue3';
import stylePlugin from 'esbuild-style-plugin';
import fs from 'fs-extra';
import httpProxy from 'http-proxy';
import minimist from 'minimist';
import 'dotenv/config';

const LINK_PRESET_TO_LIB = process.env.LINK_PRESET_TO_LIB === 'true';
const args = minimist(process.argv.slice(2));

// User should also config their bunlder to build monaco editor's resources for web worker.
const monacoEditorEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/language/css/css.worker.js',
    'vs/language/html/html.worker.js',
    'vs/language/typescript/ts.worker.js',
    'vs/editor/editor.worker.js',
];

function monacoBuildTask() {
    return esbuild.build({
        entryPoints: monacoEditorEntryPoints.map(entry => `./node_modules/monaco-editor/esm/${entry}`),
        bundle: true,
        color: true,
        target: 'chrome70',
        format: 'iife',
        outbase: './node_modules/monaco-editor/esm/',
        outdir: './local',
        plugins: [
            cleanPlugin({
                patterns: ['./local'],
            }),
        ],
    });
}

const define = {
    'process.env.NODE_ENV': args.watch ? '"development"' : '"production"',
    'process.env.UNIVER_CLIENT_LICENSE': process.env.UNIVER_CLIENT_LICENSE ? `"${process.env.UNIVER_CLIENT_LICENSE}"` : 'undefined',
};

if (!args.watch) {
    const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const gitRefName = execSync('git symbolic-ref -q --short HEAD || git describe --tags --exact-match || echo "unknown"').toString().trim();

    define['process.env.GIT_COMMIT_HASH'] = `"${gitCommitHash}"`;
    define['process.env.GIT_REF_NAME'] = `"${gitRefName}"`;
}

define['process.env.BUILD_TIME'] = `"${new Date().toISOString()}"`;
define['process.env.BUILD_TIMESTAMP'] = `"${new Date().toISOString() / 1000}"`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * link preset to lib
 * use `LINK_PRESET_TO_LIB=true pnpm dev:demo`
 */
const linkPresetToLibPlugin = {
    name: 'link-preset-to-lib-esbuild-plugin',
    setup(build) {
        console.log('[link-preset-to-lib-esbuild-plugin] enabled, preset will link to lib');
        build.onResolve({ filter: /@univerjs\/preset.*/ }, async (args) => {
            try {
                const pkgNameParts = args.path.split('/');
                const pkgDir = path.resolve(__dirname, '..', 'packages', pkgNameParts[1]);
                const pkgJson = fs.readJSONSync(path.resolve(pkgDir, 'package.json'));
                const targetPath = pkgNameParts.length > 2 ? pkgNameParts.slice(2).join('/') : '';
                const exportsConfig = pkgJson.publishConfig.exports;

                let resolvedPath;
                if (args.path === pkgJson.name) {
                    resolvedPath = path.resolve(pkgDir, exportsConfig['.'].import);
                }
                else if (fs.existsSync(path.join(pkgDir, targetPath))) {
                    resolvedPath = path.join(pkgDir, targetPath);
                }
                else {
                    const ruleKey = Object.keys(exportsConfig).find((it) => {
                        if (it === '.') {
                            return false;
                        }

                        if (targetPath) {
                            return it === targetPath || new RegExp(`^${it.replace('./', '').replace('*', '.*')}$`).test(targetPath);
                        }
                        return it === '*';
                    });

                    if (ruleKey) {
                        resolvedPath = path.join(pkgDir, exportsConfig[ruleKey].import.replace('*', targetPath));
                        if (fs.existsSync(resolvedPath)) {
                            resolvedPath = path.join(resolvedPath, 'index.js');
                        }
                        else if (path.extname(resolvedPath) === '') {
                            resolvedPath = `${resolvedPath}.js`;
                        }
                    }
                }
                if (resolvedPath) {
                    return { path: resolvedPath };
                }
            }
            catch (e) {
                console.error('Resolution error for', args.path, ':', e);
                process.exit(1);
            }
        });
    },
};

/**
 * fix `import '@univerjs/presets/lib/styles/preset-sheets-core.css'` not work on source code dev mode
 *
 * The `stylePlugin` must be loaded after the `presetLinkToProductionPlugin`.
 */
const skipPresetLibCssEsbuildPlugin = {
    name: 'skip-preset-lib-css-esbuild-plugin',
    setup(build) {
        console.log('[skip-preset-lib-css-esbuild-plugin] enabled, resolve will skip `import \'@univerjs/presets/lib/**/*.css\'`');

        build.onResolve({ filter: /\/lib\/.*\.css$/ }, async (args) => {
            if (args.path.includes('@univerjs/preset')) {
                return {
                    path: args.path,
                    namespace: 'preset-production-css',
                };
            }
        });

        build.onLoad({ filter: /.*/, namespace: 'preset-production-css' }, async () => {
            // return virtual css content
            return {
                contents: ``,
                loader: 'css',
            };
        });
    },
};

const ctx = await esbuild[args.watch ? 'context' : 'build']({
    bundle: true,
    format: 'esm',
    splitting: true,
    color: true,
    loader: { '.svg': 'file', '.ttf': 'file' },
    sourcemap: args.watch,
    minify: !args.watch,
    target: 'chrome70',
    plugins: [
        copyPlugin({
            assets: {
                from: ['./public/**/*'],
                to: ['./'],
            },
        }),
        LINK_PRESET_TO_LIB ? linkPresetToLibPlugin : skipPresetLibCssEsbuildPlugin,
        stylePlugin({
            cssModulesOptions: {
                localsConvention: 'camelCaseOnly',
                generateScopedName: 'univer-[local]',
            },
            renderOptions: {
                lessOptions: {
                    rewriteUrls: 'all',
                    paths: [
                        path.resolve(process.cwd(), './node_modules'),
                        path.resolve(process.cwd(), './node_modules/@univerjs/presets/node_modules'),
                        path.resolve(process.cwd(), './node_modules/@univerjs/presets/node_modules/@univerjs/preset-sheets-drawing/node_modules'),
                    ],
                },
            },
        }),
        vue(),
    ],
    entryPoints: [
        './src/docs-core/main.ts',

        './src/docs-advanced/main.ts',

        './src/docs-collaboration/main.ts',

        './src/sheets-core/main.ts',

        './src/sheets-core-with-worker/main.ts',
        './src/sheets-core-with-worker/worker.ts',

        './src/sheets-rich-feature/main.ts',

        './src/sheets-advanced/main.ts',

        './src/sheets-collaboration-with-worker/main.ts',
        './src/sheets-collaboration-with-worker/worker.ts',

        './src/sheets-collaboration/main.ts',
    ],

    outdir: './local',

    define,
});

if (args.watch) {
    await monacoBuildTask();
    await ctx.watch();

    const { hosts, port } = await ctx.serve({
        servedir: './local',
        port: 8011, // need different port for universer-api
    });

    const needProxyRoutes = ['/universer-api'];
    const server = http.createServer((req, res) => {
        const proxy = httpProxy.createProxyServer({});

        if (needProxyRoutes.some(route => req.url?.startsWith(route))) {
            proxy.web(req, res, {
                target: process.env.APP_ENDPOINT,
                changeOrigin: true,
                secure: false,
            });
            return;
        }

        proxy.web(req, res, {
            target: `http://${hosts[0]}:${port}`,
            changeOrigin: true,
            secure: false,
        });
    }).listen(process.env.CLIENT_PORT || 3010);

    server.on('upgrade', (req, socket, head) => {
        const proxy = httpProxy.createProxyServer({
            target: process.env.APP_ENDPOINT,
            changeOrigin: true,
            secure: false,
            ws: true,
        });
        proxy.ws(req, socket, head);
    });

    console.log(
        'Visit:\n'
        + `http://localhost:${process.env.CLIENT_PORT || 3010}\n`,
    );
}
