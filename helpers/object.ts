export function shallowCopy<T extends object>(object: T): T {
    return Object.assign({}, object);
}
