import { PaymentOption } from "./payment-option.enum";
import { SupportedCreditCard } from "./supported-credit-card.model";

export class SupportedPayments {
    supportedTypes!: PaymentOption[];
    supportedCreditCards!: SupportedCreditCard[];
}
