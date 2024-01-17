import { TransactionType } from "./transaction-type.model";

export declare type Transactions = Transaction[];

export class Transaction {
    id!: number;
    entityId!: string;
    dateTime!: Date;
    type!: TransactionType;
    description!: string;
    amount!: number;
    balance!: number;
    paypalInfoId!: number;
    checksum!: string;
}