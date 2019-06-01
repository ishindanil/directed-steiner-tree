export function getSortedHash(array: any[]) {
    const copy = array.slice();
    copy.sort();

    return getHash(copy);
}

export function getHash(array: any[]) {
    return array.join(',');
}

export function getAllSubsets<T>(array: T[]): T[][] {
    const allSubsets = [];

    for (let i = 0; i < Math.pow(2, array.length); i++) {
        let subset = [];
        for (let j = 0; j < array.length; j++) {
            if ((i & (1 << j)) > 0) subset.push(array[j]);
        }
        allSubsets.push(subset);
    }

    return allSubsets;
}
