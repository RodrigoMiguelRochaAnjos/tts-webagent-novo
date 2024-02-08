import { Settings } from "src/app/modules/home/models/settings.model";
import { patterns } from "../../../shared/utils/validation-patterns";
import { GDS } from "../gds/gds.model";
import { Contact } from "./contact/contact.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Email } from "src/app/modules/emails/models/email.model";

export abstract class User {
    public name!: string;
    public languageCode!: string;
    public currency: string = 'EUR';
    public contact!: Contact;
    public settings!: Settings;
    public terminalMessage: any;
    public emailData?: Email;

    [key: string]: any;

    public gds!: GDS;

    public isValid() {
        return (
            this.name != null &&
            this.contact != null &&
            patterns.name.test(this.name.trim()) &&
            this.contact?.isValid()
        );
    }

    public form(): FormGroup {
        return new FormGroup({
            id: new FormControl('', [Validators.required]),
            name: new FormControl('', [Validators.required, Validators.pattern(patterns.name)]),
            languageCode: new FormControl('', [Validators.required]),
            currency: new FormControl('', [Validators.required]),
        });
    }

    public abstract save(): void;
    public abstract copy(user: User): User;
}