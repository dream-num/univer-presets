import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';

const LOCLAES_MAP = [
    'en-US',
    'fa-IR',
    'ru-RU',
    'vi-VN',
    'zh-CN',
    'zh-TW',
];

const __dirname = process.cwd();

const pkg = fs.readJsonSync(path.resolve(__dirname, 'package.json'));

function convertImportNameFromPackageName(name: string) {
    return name
        .replace(/^@univerjs(?:-[^/]+)?\//, 'univerjs')
        .replace(/-/g, '');
}

export function createLocalesFiles() {
    if (!fs.pathExistsSync(path.resolve(__dirname, 'src/locales'))) {
        fs.mkdirSync(path.resolve(__dirname, 'src/locales'));
    }

    LOCLAES_MAP.forEach((localeKey) => {
        let content = `import { Tools } from '@univerjs/core';\n\n`;
        const depsSet = new Set<string>();
        Object.keys(pkg.dependencies).forEach((key) => {
            if (key.startsWith('@univerjs')) {
                const __pkgLocalesDir = path.resolve(__dirname, 'node_modules', key, 'lib/es/locale');
                const hasLocales = fs.existsSync(__pkgLocalesDir);

                if (hasLocales) {
                    depsSet.add(key);
                }
            }
        });

        depsSet.forEach((key) => {
            content += `import ${convertImportNameFromPackageName(key)} from '${key}/locale/${localeKey}';\n`;
        });

        content += `\nexport default Tools.deepMerge(\n    {},\n`;

        depsSet.forEach((key) => {
            content += `    ${convertImportNameFromPackageName(key)},\n`;
        });

        content += `);\n`;

        fs.writeFileSync(path.resolve(__dirname, 'src/locales', `${localeKey}.ts`), content);
    });
}

export function createPresetsFiles() {
    Object.keys(pkg.dependencies).forEach((key) => {
        if (key.startsWith('@univerjs/preset')) {
            const indexTs = `export * from '${key}';\n`;
            const __indexTs = path.resolve(__dirname, 'src', `${key.replace('@univerjs/', '')}/index.ts`);
            fs.ensureFileSync(__indexTs);
            fs.writeFileSync(__indexTs, indexTs);

            LOCLAES_MAP.forEach((localeKey) => {
                const localeTs = `export { default } from '${key}/locales/${localeKey}';\n`;
                const __localeTs = path.resolve(__dirname, 'src', `${key.replace('@univerjs/', '')}/locales/${localeKey}.ts`);
                fs.ensureFileSync(__localeTs);
                fs.writeFileSync(__localeTs, localeTs);
            });
        }
    });
}
