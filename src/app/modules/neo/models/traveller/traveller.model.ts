import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Contact } from "src/app/core/models/user/contact/contact.model";
import { patterns } from "src/app/shared/utils/validation-patterns";
import { PassengerType } from "../../features/search/utils/requests/air-search-request/passenger-type.enum";

export declare type Travellers = Traveller[]; 

export abstract class Traveller {
    public title!: string;
	public firstName!: string;
	public lastName: string = "";
	public dateOfBirth!: string;
    public contact!: Contact;
    public frequentFlyerNumbers: string[] = [];
    public refuseInfo: boolean = false;
    private type: PassengerType = this.toString();

    public constructor() {}

    public abstract toString(): PassengerType;

    public isValid() : boolean {
        return (
            this.form.valid &&
            (this.refuseInfo || this.contact.isValid())
        );
    }

    get form() : FormGroup {
        return new FormGroup({
            TITLE: new FormControl(this.title, Validators.required),
            FIRST_NAME: new FormControl(this.firstName, [Validators.required, Validators.pattern(patterns.name)]),
            LAST_NAME: new FormControl(this.lastName, [Validators.required, Validators.pattern(patterns.name)]),
            DATE_OF_BIRTH: new FormControl(this.dateOfBirth, Validators.required)
        });
    }
}