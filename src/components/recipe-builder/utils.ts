export function toPascalCase(orig: string) {
    return orig.split(' ')
               .map((s: string) => `${s.charAt(0).toUpperCase()}${s.substring(1)}`)
               .join(' ');
}