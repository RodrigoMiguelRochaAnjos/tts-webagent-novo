import { Settings } from "src/app/modules/home/models/settings.model";
import { patterns } from "../../../shared/utils/validation-patterns";
import { GDS } from "../gds/gds.model";
import { Contact } from "./contact/contact.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";

export abstract class User {
    public name!: string;
    public languageCode!: string;
    public currency: string = 'EUR';
    public contact!: Contact;
    public settings!: Settings;
    [key: string]: any;

    public gds!: GDS;

    public isValid() {
        return (
            this.name != null &&
            this.contact != null &&
            patterns.name.test(this.name.trim()) &&
            this.contact.isValid()
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
}