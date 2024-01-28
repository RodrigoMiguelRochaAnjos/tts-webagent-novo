
export class Stack<T> {
    private arr: Array<T>;
    private top: number;
    private capacity: number;

    constructor(size: number) {
        this.arr = new Array<T>(size);
        this.capacity = size;
        this.top = -1;
    }

    public get(index: number) : T{
        return this.arr[index];
    }

    public push(element: T): void {
        if(this.isFull()) {
            this.arr.shift();
        }

        this.arr[++this.top] = element;
    }

    public pop(): T | undefined {
        if(this.isEmpty()) return;

        return this.arr[this.top--];
    }

    public getSize(): number {
        return this.top + 1;
    }

    public isEmpty(): boolean {
        return this.top === -1;
    }

    public isFull(): boolean {
        return this.top == this.capacity - 1;
    }

    public printStack() : void {
        for(let i: number = 0; i <= this.top; i++) {
            console.log(this.arr[i]);
        }
    }
}