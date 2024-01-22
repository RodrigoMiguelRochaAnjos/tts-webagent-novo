export class Deposit {
    amount!: number;
    currency!: string;

    public isValid(): boolean {
        return (
            this.amount != null &&
            this.currency != null
        );
    }
}