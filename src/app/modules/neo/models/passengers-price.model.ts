import { Taxes } from "./tax.model";

export declare type PassengerPrices = PassengerPrice[]

export class PassengerPrice {
    amount!: number;
    currency!: string;
    exchange!: boolean;
    includeTaxes!: boolean;
    preferredCurrency!: string;
    ptc!: string;
    quantity!: number;
    taxes!: Taxes;
    totalAmount!: number;
}