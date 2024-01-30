import { Node } from "./node.structure";
export class DoublyLinkedList<T> {
    public head: Node<T> | null;
    public tail: Node<T> | null;

    constructor() {
        this.head = null;
        this.tail = null;
    }

    public append(data: T): void {
        const newNode: Node<T> = new Node<T>(data);
        if(!this.head) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }

        newNode.prev = this.tail;
        this.tail!.next = newNode;
        this.tail = newNode;
    }

    // Forward iteration
    forwardIterator(): Iterator<T> {
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

    reverseIterator(): Iterator<T> {
        let current: Node<T> | null = this.tail;
        return {
            next: () => {
                const result: IteratorResult<T> = { value: null as any, done: current == null };
                if (current) {
                    result.value = current.data;
                    current = current.prev;
                }
                return result;
            },
        };
    }
}