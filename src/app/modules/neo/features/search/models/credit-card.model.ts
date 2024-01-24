import { CardValidationResult, CreditCardValidator } from "../data-access/credit-card.validator";

export class CreditCard {
    name: string;
    number: string = "";
    securityCode: string;
    expiryDate: string; // mm/yyyy
    cardType: string;

    constructor(
        name: string,
        number: string,
        securityCode: string,
        expiryDate: string,
        cardType: string
    ) {
        this.name = name;
        this.number = number == null ? "" : number.toString();
        this.securityCode = securityCode;
        this.expiryDate = expiryDate;
        this.cardType = cardType;
    }

    public isValid(): boolean {
        return (
            this.name != "" &&
            this.number != "" &&
            this.securityCode != "" &&
            this.expiryDate != "" &&
            this.cardType != "" &&
            (CreditCardValidator.validateCard(this.number.toString()) == CardValidationResult.ValidCard)
        );
    }

    public equals(creditCard: any): boolean {
        if (!(creditCard instanceof CreditCard)) return false;

        creditCard = creditCard as CreditCard;

        return (
            creditCard.name == this.name &&
            creditCard.number == this.number &&
            creditCard.securityCode == this.securityCode &&
            creditCard.expiryDate == this.expiryDate &&
            creditCard.cardType == this.cardType
        )
    }

    public copy(): CreditCard {
        return new CreditCard(
            this.name,
            this.number,
            this.securityCode,
            this.expiryDate,
            this.cardType
        );
    }
}
