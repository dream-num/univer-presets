import type { Plugin } from 'vite';
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

interface IOptions {
    umdDeps: string[];
}

export function prependUMDRawPlugin(options: IOptions): Plugin {
    const { umdDeps } = options;

    return {
        name: 'prepend-umd-raw-plugin',

        closeBundle() {
            const __nodeModules = path.resolve(process.cwd(), 'node_modules');
            const __umd = path.resolve(process.cwd(), 'lib/umd/index.js');

            const umdContents: string[] = [];

            umdDeps.forEach((dep) => {
                const __dep = path.resolve(__nodeModules, dep);
                const __depIndex = path.resolve(__dep, 'lib/umd/index.js');
                const __depFacade = path.resolve(__dep, 'lib/umd/facade.js');

                umdContents.push(`// ${__dep}`);
                umdContents.push(fs.readFileSync(__depIndex, 'utf8'));

                if (fs.existsSync(__depFacade)) {
                    umdContents.push(`// ${__dep}/facade`);
                    umdContents.push(fs.readFileSync(__depFacade, 'utf8'));
                }
            });
            umdContents.push(fs.readFileSync(__umd, 'utf8'));

            fs.writeFileSync(__umd, umdContents.join('\n\n'));

            const __localeDir = path.resolve(process.cwd(), 'lib/umd/locales');

            LOCLAES_MAP.forEach((localeKey) => {
                const localeContents: string[] = [];

                umdDeps.forEach((dep) => {
                    const __dep = path.resolve(__nodeModules, dep);
                    const __depLocale = path.resolve(__dep, 'lib/umd/locale', `${localeKey}.js`);

                    if (fs.existsSync(__depLocale)) {
                        umdContents.push(`// ${__dep}/locale/${localeKey}`);
                        localeContents.push(fs.readFileSync(__depLocale, 'utf8'));
                    }
                });

                const __locale = path.resolve(__localeDir, `${localeKey}.js`);
                fs.ensureFileSync(__locale);
                fs.writeFileSync(__locale, localeContents.join('\n\n'));
            });
        },
    };
}
