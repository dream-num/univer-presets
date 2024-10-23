// This script is to generate locale files for each presets.
// This is a modified version of the script with the same name at `dream-num/univer/examples/scripts`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line no-extend-native
Array.prototype.unique = function () {
    return Array.from(new Set(this));
};

/**
 * Generate locales for a preset.
 *
 * @param {string} rootDir The folder where the preset is at.
 */
function generateLocales(rootDir) {
    const presetsFileContent = fs.readFileSync(path.resolve(rootDir, 'index.ts'), 'utf-8');

    // Use regex to get all Univer packages from the string.
    const packageNameRE = /'(@univerjs(.*?))'/g;
    let packageNames = Array.from(presetsFileContent.matchAll(packageNameRE))
        .map(m => m[1])
        .filter(m => !m.endsWith('facade'))
        .unique();

    packageNames = packageNames.filter(dep => fs.existsSync(path.resolve(__dirname, `../node_modules/${dep}/src/locale`)));
    if (packageNames.length === 0) {
        return;
    }

    const header = `/**
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

import { Tools } from '@univerjs/core';
`;

    /**
     * Generate for each language.
     *
     * @param {string} locale Language identifier list in `locales`.
     */
    function generateForLocale(locale) {
        const output = path.join(rootDir, `${locale}.ts`);
        const importStatements = packageNames.reduce((acc, dep) => {
            const formattedDep = dep.replace(/(@univerjs(-pro)?\/|-)/g, '');
            acc += `import ${formattedDep}${locale.replace(/-/g, '')} from '${dep}/locale/${locale}';\n`;
            return acc;
        }, '');

        const formattedLocale = locale.replace(/-/g, '');
        const depStatements = packageNames.map((dep) => {
            return `    ${dep.replace(/(@univerjs(-pro)?\/|-)/g, '')}${formattedLocale}`;
        }).join(',\n');

        const exportStatements = `export const ${formattedLocale} = Tools.deepMerge(\n    {},\n${depStatements},\n);\n`;
        const content = `${header}\n${importStatements}\n${exportStatements}`;

        fs.writeFileSync(output, content);
    }

    const locales = ['en-US', 'ru-RU', 'zh-CN', 'zh-TW', 'vi-VN', 'fa-IR'];
    locales.forEach(generateForLocale);
}

function scanPresetsAndGenerate() {
    const presetRoots = [
        '../src/presets/sheets',
        '../src/presets/docs',
        '../src/presets/sheets-node',
    ];

    presetRoots.forEach((root) => {
        const presetRootPath = path.resolve(__dirname, root);
        if (!fs.existsSync(presetRootPath)) {
            return;
        }

        const list = fs.readdirSync(presetRootPath);
        for (const f of list) {
            const ifDir = `${presetRootPath}/${f}`;
            if (fs.existsSync(ifDir) && fs.statSync(ifDir).isDirectory()) {
                generateLocales(ifDir);
            }
        }
    });
}

scanPresetsAndGenerate();
