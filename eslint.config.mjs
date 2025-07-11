import antfu from '@antfu/eslint-config';

export default antfu({
    ignores: [
        '**/lib',
        '**/node_moudles',
        '**/local',
        'common/shared/react-polyfill/react-polyfill.js',
        'common/shared/redi-umd@0.19.2/**',
    ],
    stylistic: {
        indent: 4,
        semi: true,
    },
    yaml: {
        overrides: {
            'yaml/indent': ['error', 4, { indicatorValueIndent: 2 }],
        },
    },
    typescript: true,
    formatters: true,
});
