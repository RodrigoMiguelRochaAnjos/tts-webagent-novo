import { Node } from "./node.structure";

export class CircularLinkedList<T> {
    public head: Node<T> | null;
    public tail: Node<T> | null;

    private maxSize?: number;

    constructor(size?: number) {
        if(size != null) this.maxSize = size;
        this.head = null;
        this.tail = null;
    }

    append(data: T): void {
        const newNode = new Node(data);

        console.log("IS HEAD NULL: ", this.head == null);
        console.log("HEAD: ", this.head?.data);
        if (this.head == null) {
            this.head = newNode;
            this.tail = newNode;
            newNode.next = this.head; // Point back to the head for circularity
            return;
        }

        this.tail!.next = newNode;
        newNode.next = this.head; // Point back to the head for circularity
        this.tail = newNode;
        
        if(this.maxSize == null) return;

        if (this.getSize() > this.maxSize) {
            this.head = this.head!.next;
        }
    }

    forwardsIterator(): Iterator<T> {
        let current: Node<T> | null = this.head;

        return {
            next: () => {
                const result: IteratorResult<T> = { value: null as any, done: current == null };
                if (current) {
                    result.value = current.data;
                    current = current.next;
                }
                return result;
            },
        };
    }

    backwardIterator(): Iterator<T> {
        let current: Node<T> | null = this.tail;

        return {
            next: () => {
                const result: IteratorResult<T> = { value: null as any, done: current == null };
                if (current) {
                    result.value = current.data;
                    current = current === this.head ? this.tail : this.findPrevious(current);
                }
                return result;
            },
        };
    }

    private findPrevious(node: Node<T>): Node<T> | null {
        let current = this.head;
        while (current && current.next !== node) {
            current = current.next;
        }
        return current;
    }

    public getSize(): number {
        if (!this.head) {
            return 0;
        }

        let size = 1;
        let current = this.head.next;
        while (current && current !== this.head) {
            size++;
            current = current.next;
        }

        return size;
    }

    public toList(): T[] {
        const result: T[] = [];

        if (this.head == null) return result;

        let current: Node<T> = this.head;

        do {
            result.push(current.data);

            if(current.next == null) break;
            
            current = current.next;
        } while(current !== this.head);

        return result;
    }

    public getTail(): T | null {
        if(this.tail == null) return null;
        
        return this.tail.data;
    }
}