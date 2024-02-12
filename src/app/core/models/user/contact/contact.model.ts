import { FormControl, FormGroup, Validators } from "@angular/forms";
import { patterns } from "../../../../shared/utils/validation-patterns";
import { Phone } from "./segments/phone.model";
import { Address } from "./segments/address.model";

export class Contact {
    phone!: Phone;
    title!: string;
	firstName!: string;
	lastName!: string;
	address!: Address | null;
    email!: string;
    entityName?: string;

    public isValid(): boolean {
        return (
            this.email != null &&
            patterns.email.test(this.email.trim()) &&
            this.phone != null && this.phone?.isValid()
        );
    }

    public form() : FormGroup {
        return new FormGroup({
            COUNTRY_DIAL_CODE: new FormControl(this.phone.dialCode, [Validators.required]),
            PHONE: new FormControl(this.phone.number, [Validators.required]),
            EMAIL: new FormControl(this.email, [Validators.required, Validators.pattern(patterns.email)]),
        });
    }

    public save(): void {
        const contact: string = JSON.stringify({
            type: "Contact",
            data: {
                email: this.email,
                phone: JSON.stringify(this.phone)
            }
        });

        localStorage.setItem("contact", contact);
    }

    public load(): void {
        const storageItem : string | undefined = localStorage.getItem("contact")?.toString();
        
        if(storageItem == null) return;
        

        JSON.parse(storageItem, (key, value) => {
            if(key === 'type' && value != "Contact") return;
            
            switch(key) {
                case 'title':
                    this.title = value;
                    break;
                case 'firstName':
                    this.firstName = value;
                    break;
                case 'lastName':
                    this.lastName = value;
                    break;
                case 'email':
                    this.email = value;
                    break;
                case 'address':
                    this.address = Object.assign<Address, any>(new Address() , JSON.parse(value));
                    break;
                case 'phone':
                    this.phone = Object.assign<Phone, any>(new Phone() , JSON.parse(value));
                    break;
            }
        });
    }

    

}