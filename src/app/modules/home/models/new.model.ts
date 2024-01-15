export declare type News = New[];
export class New {
    title: string;
    text: string;
    link: string;
    date: Date;

    constructor(title: string, text: string, link: string, date: Date) {
        this.title = title;
        this.text = text;
        this.link = link;
        this.date = date;
    }
}
