export function pullAt<T>(array: T[], ...indices: number[]): T[] {
    // Ensure indices are unique and sorted in descending order
    indices = Array.from(new Set(indices)).sort((a, b) => b - a);

    for (const index of indices) {
        if (index >= 0 && index < array.length) {
            array.splice(index, 1);
        }
    }

    return array;
}