import { Component, Input, OnInit } from '@angular/core';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import { countriesDialCodes } from 'src/app/shared/utils/countries-dial-codes.data';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { Observable, takeUntil } from 'rxjs';
import { Settings } from 'src/app/modules/home/models/settings.model';
import { TranslateService } from '@ngx-translate/core';
import { DestroyService } from 'src/app/core/services/destroy.service';
import { AnonymousUser } from 'src/app/core/models/user/types/anonymous-user.model';
import { Contact } from 'src/app/core/models/user/contact/contact.model';
import { Phone } from 'src/app/core/models/user/contact/segments/phone.model';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { AlertService } from 'src/app/core/services/alert.service';
import { Address } from 'src/app/core/models/user/contact/segments/address.model';
import { AuthenticatedUser } from 'src/app/core/models/user/types/authenticated-user.model';
import { IncompleteUser } from 'src/app/core/models/user/types/incomplete-user.model';
import { currencies } from '../../utils/currencies.tools';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit{
    InputType = InputType;
    patterns = patterns;
    countriesDialCodes = countriesDialCodes;
    currencies = currencies;

    settingsLoaded: boolean = false;

    countriesDialCodeOptions: string[] = []
    
    private oldSettings: Settings = new Settings();
    tmpSettings: Settings = new Settings();

    user$!: Observable<User>;

    private messages: {[key: string]: string} = {
        'ERROR': '',
        'UNSAVED_CHANGES_MESSAGE_TITLE': '',
        'UNSAVED_CHANGES_MESSAGE': '',
        'INVALID_FIELDS_MESSAGE': '',
    }

    constructor(
        private authService: AuthService,
        private destroyService: DestroyService,
        private alertService: AlertService,
        private translate: TranslateService
    ) {
        this.authService.getUser().subscribe((user: User) => {
            if(!(user instanceof AuthenticatedUser || user instanceof IncompleteUser)) return;
            this.settingsLoaded = true;
        })
        Object.keys(this.messages).forEach((key: string) => {
            translate.stream(key).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((text: string) => this.messages[key] = text);
        });

        this.countriesDialCodeOptions = Object.keys(this.countriesDialCodes);
        this.user$ = this.authService.getUser();
    }

    ngOnInit(): void {
        this.user$.subscribe((user: User) => {
            this.oldSettings = user.settings ? user.settings : new Settings();
            this.tmpSettings = user.settings ? user.settings : new Settings();
        })
    }

    get canSave() : boolean {
        return JSON.stringify(this.oldSettings) !== JSON.stringify(this.tmpSettings);
    }

    update(): void {
        const user: User = this.authService.getUserValue();

        if(user instanceof AnonymousUser) return;

        user.currency = this.tmpSettings.currency;

        user.name = this.tmpSettings.profileName;
        user.contact = new Contact();
        user.contact.email = this.tmpSettings.profileEmail;
        user.contact.phone = new Phone();

        user.contact.phone.dialCode = `+${this.tmpSettings.profileCountryDialCode}`;
        user.contact.phone.number = this.tmpSettings.profilePhone;



        try {
            if(this.validateInputs()) {
                user.save();
                this.authService.updateUserSettings(this.tmpSettings);
                this.changeLanguage();
            }
        
        } catch (er) {
            er = er as Error;
            this.alertService.show(AlertType.ERROR, this.messages['INVALID_FIELDS_MESSAGE'])
        }
    }

    private isValidInput(value: string, pattern: RegExp): boolean {
        return pattern.test(value);
    }

    validateInputs(): boolean {

        const errors: string[] = [];

        if(!this.isValidInput(this.tmpSettings.profileName, patterns.name)) errors.push("The user's profile name is invalid, please try again");

        if(!this.isValidInput(this.tmpSettings.profilePhone, patterns.phone)) errors.push("The user's profile phone number is invalid, please try again");

        if(!this.isValidInput(this.tmpSettings.profileEmail, patterns.email)) errors.push("The user's profile email is invalid, please try again");

        if(!this.isValidInput(this.tmpSettings.address.city, patterns.city)) errors.push("The user's profile city address is invalid, please try again");

        if(!this.isValidInput(this.tmpSettings.agencyEntityName, patterns.text)) errors.push("The user's agency entity name is invalid, please try again");

        if(!this.isValidInput(this.tmpSettings.address.street, patterns.text)) errors.push("The user's agency street is invalid, please try again");

        if(!this.isValidInput(this.tmpSettings.address.postCode, patterns.postCode)) errors.push("The user's agency post code is invalid, please try again");

        if(!this.isValidInput(this.tmpSettings.address.countryCode, patterns.countryCode)) errors.push("The user's agency country code is invalid, please try again");

        if (errors.length === 0) {
            this.alertService.show(AlertType.SUCCESS, "All form information is valid!");
            return true;

          } else {
            const errorMessage = errors.join('\n');
            this.alertService.show(AlertType.ERROR, `Invalid input(s) detected:\n${errorMessage}`)
            return false;
        }
    }

    changeLanguage(): void {
        this.translate.use(this.tmpSettings.languageCode);
    }
}
