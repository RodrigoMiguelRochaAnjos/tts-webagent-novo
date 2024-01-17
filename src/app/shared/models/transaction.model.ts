export declare type Transactions = Transaction[];

export class Transaction {
    id!: number;
    entityId!: string;
    dateTime!: Date;
    type!: "F" | "C" | "D";
    description!: string;
    amount!: number;
    balance!: number;
    paypalInfoId!: number;
    checksum!: string;
}