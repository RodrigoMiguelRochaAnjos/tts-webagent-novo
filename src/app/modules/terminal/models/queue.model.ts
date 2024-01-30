export class Queue {
    id: number;
    name: string;
    totalBfs: number;

    constructor(id: number, name: string, totalBfs: number) {
        this.id = id;
        this.name = name;
        this.totalBfs = totalBfs;
    }

    static fromServer(serverData: any): Queue {
        return new Queue(serverData.number, serverData.name, serverData.count);
    }
}
