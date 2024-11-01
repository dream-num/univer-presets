import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const __packagesDir = path.resolve(__dirname, '../packages');

const pkgs = fs.readdirSync(__packagesDir).filter(pkg => pkg.startsWith('preset'));

const __mainPkg = path.resolve(__dirname, '../packages/presets');
const __mainPkgJSON = path.resolve(__mainPkg, './package.json');

const mainPkgJSON = fs.readJSONSync(__mainPkgJSON, 'utf8');

const LOCLAES_MAP = [
    'en-US',
    'fa-IR',
    'ru-RU',
    'vi-VN',
    'zh-CN',
    'zh-TW',
];

pkgs.forEach((pkg) => {
    if (!pkg.startsWith('preset-'))
        return;

    // modify package.json
    mainPkgJSON.exports[`./${pkg}`] = `./src/${pkg}/index.ts`;
    mainPkgJSON.exports[`./${pkg}/*`] = `./src/${pkg}/*.ts`;
    mainPkgJSON.dependencies[`@univerjs/${pkg}`] = 'workspace:*';

    fs.ensureDirSync(path.resolve(__mainPkg, `./src/${pkg}`));

    const __pkg = path.resolve(__packagesDir, pkg);
    const pkgJson = fs.readJSONSync(path.resolve(__pkg, 'package.json'));

    // create presets/preset-[pkg]/index.ts
    fs.writeFileSync(path.resolve(__mainPkg, `./src/${pkg}/index.ts`), `export * from '@univerjs/${pkg}';\n`);

    // create presets/preset-[pkg]/web-worker.ts
    if (pkgJson.exports['./web-worker']) {
        fs.writeFileSync(path.resolve(__mainPkg, `./src/${pkg}/web-worker.ts`), `export * from '@univerjs/${pkg}/web-worker';\n`);
    }
    // create presets/preset-[pkg]/locales/[lang].ts
    if (pkgJson.exports['./locales/*']) {
        fs.ensureDirSync(path.resolve(__mainPkg, `./src/${pkg}/locales`));
        LOCLAES_MAP.forEach((locale) => {
            fs.writeFileSync(path.resolve(__mainPkg, `./src/${pkg}/locales/${locale}.ts`), `export { default } from '@univerjs/${pkg}/locales/${locale}';\n`);
        });
    }

    const pkgWithLocales = [];
    Object.keys(pkgJson.dependencies)
        .filter(dep => dep.startsWith('@univerjs/') || dep.startsWith('@univerjs-pro/'))
        .forEach((dep) => {
            const hasLocales = fs.existsSync(path.resolve(__pkg, './node_modules', dep, './lib/locale'));

            if (hasLocales) {
                pkgWithLocales.push(dep);
            }
        });

    LOCLAES_MAP.forEach((locale) => {
        const __locales = path.resolve(__dirname, '../packages', pkg, './src/locales');
        fs.ensureDirSync(__locales);
        let content = `import { Tools } from '@univerjs/core';\n\n`;
        pkgWithLocales.forEach((dep) => {
            const name = dep.replace(/([\-@/])/g, '');
            content += `import ${name} from '${dep}/locale/${locale}';\n`;
        });
        content += `\nexport default Tools.deepMerge(\n`;
        content += `    {},\n`;
        pkgWithLocales.forEach((dep) => {
            const name = dep.replace(/([\-@/])/g, '');
            content += `    ${name},\n`;
        });
        content += `);\n`;

        fs.writeFileSync(path.resolve(__locales, `${locale}.ts`), content);
    });
});

fs.writeFileSync(__mainPkgJSON, `${JSON.stringify(mainPkgJSON, null, 4)}\n`);
