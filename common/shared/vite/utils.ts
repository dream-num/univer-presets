export function convertLibNameFromPackageName(name: string) {
    return name
        .replace(/^@(univerjs(?:-pro)?)\//, (_, matchedPrefix) => {
            return matchedPrefix === 'univerjs-pro' ? 'univer-pro-' : 'univer-';
        })
        .replace('/lib', '')
        .replace('/locale/', '-')
        .replace('/facade', '-facade')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};
