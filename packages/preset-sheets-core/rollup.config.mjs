import typescript from '@rollup/plugin-typescript';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser'; // 可选：用于压缩代码

async function build() {
    try {
        const bundle = await rollup({
            input: 'src/index.ts', // 项目入口
            plugins: [
                typescript({
                    tsconfig: './tsconfig.json', // 使用项目的 tsconfig.json
                    // 或者，如果需要自定义 compilerOptions:
                    // compilerOptions: {
                    //   // ...你的 TypeScript 编译选项
                    // },

                    declaration: true, // 可选：生成 .d.ts 文件
                    declarationDir: 'dist', // 可选：指定 .d.ts 文件输出目录
                }),

                // 可选：用于压缩代码
                // terser(),
            ],
            external: [
                '@univerjs/core',
                '@univerjs/design',
                '@univerjs/docs',
                '@univerjs/docs-ui',
                '@univerjs/engine-formula',
                '@univerjs/engine-render',
                '@univerjs/facade',
                '@univerjs/rpc',
                '@univerjs/sheets',
                '@univerjs/sheets-formula',
                '@univerjs/sheets-formula-ui',
                '@univerjs/sheets-numfmt',
                '@univerjs/sheets-ui',
                '@univerjs/ui',

                '@univerjs/sheets/facade',
                '@univerjs/ui/facade',
                '@univerjs/docs-ui/facade',
                '@univerjs/sheets-ui/facade',
                '@univerjs/engine-formula/facade',
                '@univerjs/sheets-formula/facade',
                '@univerjs/sheets-numfmt/facade',
            ],
        });

        await bundle.write({
            format: 'umd',
            file: 'dist/bundle.js',
            name: 'UniverSheetsCorePreset',
            globals: {
                '@univerjs/core': 'UniverCore',
                '@univerjs/design': 'UniverDesign',
                '@univerjs/docs': 'UniverDocs',
                '@univerjs/docs-ui': 'UniverDocsUI',
                '@univerjs/engine-formula': 'UniverFormulaEngine',
                '@univerjs/engine-render': 'UniverRenderEngine',
                '@univerjs/facade': 'UniverFacade',
                '@univerjs/rpc': 'UniverRPC',
                '@univerjs/sheets': 'UniverSheets',
                '@univerjs/sheets-formula': 'UniverSheetsFormula',
                '@univerjs/sheets-formula-ui': 'UniverSheetsFormulaUI',
                '@univerjs/sheets-numfmt': 'UniverSheetsNumfmt',
                '@univerjs/sheets-ui': 'UniverSheetsUI',
                '@univerjs/ui': 'UniverUI',
            },
        });

        console.log('打包完成！');
    }
    catch (error) {
        console.error('打包失败：', error);
    }
}

build();
