export function formatIntoQueryString(values: string[], key: string): string {
    const formattedValues: string[] = values.map((value) => `${key}=${value}`);
    return `?${formattedValues.join('&')}`;
}