export function deepClone<T>(source: T): T {
    if (source === null || typeof source !== 'object') {
        return source; // If it's a primitive or null, return as is
    }

    if (Array.isArray(source)) {
        // If it's an array, recursively clone each element
        return source.map(element => deepClone(element)) as T;
    }

    // If it's an object, recursively clone each property
    const clonedObject: { [key: string]: any } = {};
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            clonedObject[key] = deepClone(source[key]);
        }
    }

    return clonedObject as T;
}