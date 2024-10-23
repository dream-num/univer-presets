import { execSync } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import detect from 'detect-port';
import esbuild from 'esbuild';
import cleanPlugin from 'esbuild-plugin-clean';
import copyPlugin from 'esbuild-plugin-copy';
import vue from 'esbuild-plugin-vue3';
import stylePlugin from 'esbuild-style-plugin';
import httpProxy from 'http-proxy';
import minimist from 'minimist';
import 'dotenv/config';

const nodeModules = path.resolve(process.cwd(), './node_modules');
const presetsNodeModules = path.resolve(process.cwd(), './node_modules/@univerjs/presets/node_modules');

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
};

if (!args.watch) {
    const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const gitRefName = execSync('git symbolic-ref -q --short HEAD || git describe --tags --exact-match').toString().trim();

    define['process.env.GIT_COMMIT_HASH'] = `"${gitCommitHash}"`;
    define['process.env.GIT_REF_NAME'] = `"${gitRefName}"`;
}

define['process.env.BUILD_TIME'] = `"${new Date().toISOString()}"`;
define['process.env.BUILD_TIMESTAMP'] = `"${new Date().toISOString() / 1000}"`;

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
        stylePlugin({
            cssModulesOptions: {
                localsConvention: 'camelCaseOnly',
                generateScopedName: 'univer-[local]',
            },
            renderOptions: {
                lessOptions: {
                    rewriteUrls: 'all',
                    paths: [
                        nodeModules,
                        presetsNodeModules,
                    ],
                },
            },
        }),
        vue(),
    ],
    entryPoints: [
        './src/sheets-basic/main.ts',

        './src/sheets-basic-with-worker/main.ts',
        './src/sheets-basic-with-worker/worker.ts',

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

    const { host, port } = await ctx.serve({
        servedir: './local',
        port: 8011, // need different port for universer-api
    });

    const needProxyRoutes = ['/universer-api', '/yuumi-api'];
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
            target: `http://${host}:${port}`,
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
        + `http://localhost:${process.env.CLIENT_PORT || 3010}\n`
        + `http://local.univer.plus:${process.env.CLIENT_PORT || 3010}`,
    );
}
