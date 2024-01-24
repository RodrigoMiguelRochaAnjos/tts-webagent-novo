import { Address } from "src/app/core/models/user/contact/segments/address.model";
import { PaymentOption } from "./payment-option.enum";
import { CreditCard } from "./credit-card.model";

export class Payment {
    ref: string;
    type: PaymentOption;
    entityName: string;
    creditCard: CreditCard | null;
    address: Address | null;

    constructor(
        ref: string,
        type: PaymentOption,
        entityName: string,
        creditCard: CreditCard | null,
        address: Address | null
    ) {
        this.ref = ref;
        this.type = type;
        this.entityName = entityName;
        this.creditCard = creditCard;
        this.address = address;
    }

    public isEmpty(): boolean {
        return (
            this.ref === '' &&
            this.type === PaymentOption.CASH &&
            this.entityName === '' &&
            this.creditCard == null &&
            this.address == null
        )
    }
}
