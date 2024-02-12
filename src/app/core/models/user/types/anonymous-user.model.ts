import { Apollo } from "../../gds/types/apollo.model";
import { Galileo } from "../../gds/types/galileo.model";
import { Worldspan } from "../../gds/types/worldspan.model";
import { Contact } from "../contact/contact.model";
import { Phone } from "../contact/segments/phone.model";
import { User } from "../user.model";

export class AnonymousUser extends User{
    public override name: string;
    public override languageCode: string;
    public override currency: string;
    public override contact: Contact;
    
    constructor() {
        super();
        
        this.name = "Anonymous";
        this.languageCode = 'en';
        this.currency = 'EUR';
        this.contact = new Contact();
        
        this.contact.email= "anonymous@email.com";
        this.contact.phone = new Phone();
        this.contact.phone.dialCode = '351';
        this.contact.phone.number = '911111111'
    }

    public override save(): void {
        if(!this.isValid()) {
            throw new Error("Invalid user");
        }

        const user: string = JSON.stringify({
            type: "AnonymousUser",
            data: {
                name: this.name,
                languageCode: this.languageCode,
                currency: this.currency
            }
        });

        localStorage.removeItem("user");
        localStorage.setItem("user", user);
    }

    public copy(user: User): AnonymousUser {

        return this;
    }
}