import { PassengerPrices } from "./passengers-price.model";
import { Taxes } from "./tax.model";

export class AirSearchPrice {
    amount!: number;
    currency!: string;
    exchange!: boolean;
    includeTaxes!: boolean;
    passengersPrices!: PassengerPrices;
    preferredCurrency!: string;
    taxes!: Taxes;
    totalAmount!: number;

    isValid(): boolean {
        return (
            this.amount >= 0 
        );
    }
}