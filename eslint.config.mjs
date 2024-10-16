import antfu from '@antfu/eslint-config';

export default antfu({
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
