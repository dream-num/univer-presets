import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';

const LOCLAES_MAP = [
    'en-US',
    'fa-IR',
    'fr-FR',
    'ko-KR',
    'ru-RU',
    'vi-VN',
    'zh-CN',
    'zh-TW',
];

interface IOptions {
    umdDeps: string[];
    umdAdditionalFiles: string[];
}

export default function prependUMDRaw(options: IOptions) {
    const { umdDeps, umdAdditionalFiles } = options;

    const __nodeModules = path.resolve(process.cwd(), 'node_modules');
    const __umd = path.resolve(process.cwd(), 'lib/umd/index.js');

    const umdContentsMap: Map<string, string> = new Map();

    umdAdditionalFiles.forEach((file) => {
        const content = `// ${file}\n${fs.readFileSync(file, 'utf8')}`;
        umdContentsMap.set(file, content);
    });

    umdDeps.forEach((dep) => {
        const __dep = path.resolve(__nodeModules, dep);
        const __depIndex = path.resolve(__dep, 'lib/umd/index.js');
        const __depFacade = path.resolve(__dep, 'lib/umd/facade.js');

        const key = `${dep}/index`;
        const content = `// ${key}\n${fs.readFileSync(__depIndex, 'utf8')}`;
        if (!umdContentsMap.has(key)) {
            umdContentsMap.set(key, content);
        }

        if (fs.existsSync(__depFacade)) {
            const key = `${dep}/facade`;
            const content = `// ${key}\n${fs.readFileSync(__depFacade, 'utf8')}`;
            if (!umdContentsMap.has(key)) {
                umdContentsMap.set(key, content);
            }
        }
    });

    if (fs.existsSync(__umd)) {
        const key = 'index';
        const content = `// ${key}\n${fs.readFileSync(__umd, 'utf8')}`;
        if (!umdContentsMap.has(key)) {
            umdContentsMap.set(key, content);
        }
    }

    const umdContents = Array.from(umdContentsMap.values()).join('\n\n');
    fs.writeFileSync(__umd, umdContents);

    const __localeDir = path.resolve(process.cwd(), 'lib/umd/locales');

    LOCLAES_MAP.forEach((localeKey) => {
        const localeContentsMap: Map<string, string> = new Map();

        umdDeps.forEach((dep) => {
            const __dep = path.resolve(__nodeModules, dep);
            const __depLocale = path.resolve(__dep, 'lib/umd/locale', `${localeKey}.js`);

            if (fs.existsSync(__depLocale)) {
                const key = `${dep}/locale/${localeKey}`;
                const content = `// ${key}\n${fs.readFileSync(__depLocale, 'utf8')}`;
                if (!localeContentsMap.has(key)) {
                    localeContentsMap.set(key, content);
                }
            }
        });

        const __locale = path.resolve(__localeDir, `${localeKey}.js`);

        if (fs.existsSync(__locale)) {
            const key = `locale/${localeKey}`;
            const content = `// ${key}\n${fs.readFileSync(__locale, 'utf8')}`;

            if (!localeContentsMap.has(key)) {
                localeContentsMap.set(key, content);
            }

            const localeContents = Array.from(localeContentsMap.values()).join('\n\n');
            fs.writeFileSync(__locale, localeContents);
        }
    });
}
