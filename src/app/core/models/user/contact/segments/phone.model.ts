import { FormControl, FormGroup, Validators } from "@angular/forms";
import { patterns } from "../../../../../shared/utils/validation-patterns";

export class Phone{
    dialCode!: string;
	number!: string;

    public isValid(): boolean {
        return (
            this.dialCode!= null &&
            this.number != null &&
            patterns.phone.test(this.number.trim())
        );
    }

    public form() : FormGroup {
        return new FormGroup({
            number: new FormControl('', [Validators.required, Validators.pattern(patterns.phone)]),
            dialCode: new FormControl('', Validators.required),
        })
    }
}