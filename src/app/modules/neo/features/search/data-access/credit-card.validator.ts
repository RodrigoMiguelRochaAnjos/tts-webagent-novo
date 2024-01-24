import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CreditCardValidator {
    // Regular expressions for card types
    private static readonly creditCardPatterns: { [key: string]: RegExp } = {
        visa: /^(4[0-9]{12}(?:[0-9]{3})?)$/,
        mastercard: /^(5[1-5][0-9]{14})$/,
        amex: /^(3[47][0-9]{13})$/,
        discover: /^(6(?:011|5[0-9]{2})[0-9]{12})$/,
        dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    };

    private static readonly debitCardPatterns: { [key: string]: RegExp } = {
        visadebit: /^(4[012345]\d{2}|4[678]\d{3}|4[9]\d{2}|417500)\d{10}$/,
        mastercarddebit: /^(51|52|53|54|55|222[1-9]|22[3-9]\d)\d{12}$/,
        amexdebit: /^(34|37)\d{13}$/,
        discoverdebit: /^(6011|65|64[4-9]|622)\d{12}$/,
    };

    // Validates a credit card number
    static validateCard(cardNumber: string): CardValidationResult {
        // Remove non-digit characters
        cardNumber = cardNumber.replace(/\D/g, '');

        // Check if the card number is of valid length
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            return CardValidationResult.InvalidLength;
        }

        return CardValidationResult.ValidCard;
    }

    // Determines the card type based on the number's prefix
    public static getCardType(cardNumber: string): string | undefined {
        for (const type in this.creditCardPatterns) {
            if (this.creditCardPatterns[type].test(cardNumber)) {
                return type;
            }
        }

        for (const type in this.debitCardPatterns) {
            if (this.debitCardPatterns[type].test(cardNumber)) {
                return type;
            }
        }

        return undefined; // Card type not recognized
    }

    // Validates the card number using the Luhn algorithm
    private static passesLuhnAlgorithm(cardNumber: string): boolean {
        let sum = 0;
        let doubleUp = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);

            if (doubleUp) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            doubleUp = !doubleUp;
        }

        return sum % 10 === 0;
    }
}


export enum CardValidationResult {
    ValidCard = 'ValidCard',
    InvalidLength = 'InvalidLength',
    InvalidLuhnAlgorithm = 'InvalidLuhnAlgorithm',
    UnknownCardType = 'UnknownCardType',
}