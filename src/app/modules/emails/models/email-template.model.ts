export class EmailTemplate {
    name: string;
    subject: string;
    header: string;
    footer: string;

    constructor(name: string, subject: string, header: string, footer: string) {
        this.name = name;
        this.subject = subject;
        this.header = header;
        this.footer = footer;
    }

    isTheSameAs(templateToCompare: EmailTemplate): boolean {
        return (
            this.name === templateToCompare.name &&
            this.subject === templateToCompare.subject &&
            this.header === templateToCompare.header &&
            this.footer === templateToCompare.footer
        );
    }
}
