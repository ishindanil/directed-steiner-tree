export class SortedList<T> {
    private array: Array<T> = [];
    public compareFunction: (a: T, b: T) => 1 | -1;

    constructor(compareFunction = (a: T, b: T) => (a >= b ? 1 : -1)) {
        this.compareFunction = compareFunction;
    }

    public add(item) {
        if (!this.array.length) {
            this.array.push(item);

            return;
        }

        if (this.compareFunction(item, this.array[0]) === -1) {
            this.array.unshift(item);

            return;
        }

        for (let i = 1; i < this.array.length - 1; i++) {
            if (
                this.compareFunction(item, this.array[i]) === 1 &&
                this.compareFunction(item, this.array[i + 1]) === -1
            ) {
                this.array.splice(i + 1, 0, item);

                return;
            }
        }

        this.array.push(item);
    }

    public extractFirstElement() {
        return this.array.shift();
    }
}
