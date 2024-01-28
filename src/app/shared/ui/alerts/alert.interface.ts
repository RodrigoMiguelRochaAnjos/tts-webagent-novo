
export abstract class Alert {
    public title: string;
    public alertId!: string;
    public content: any;

    constructor(title: string) {
        this.title = title;
    }
}
