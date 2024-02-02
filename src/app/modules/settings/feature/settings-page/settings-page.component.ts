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

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit{
    InputType = InputType;
    patterns = patterns;
    countriesDialCodes = countriesDialCodes;

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

        user.name = this.tmpSettings.profileUserName;
        user.contact = new Contact();
        user.contact.email = this.tmpSettings.profileUserEmail;
        user.contact.phone = new Phone();
        user.contact.phone.dialCode = `+${this.tmpSettings.profileUserDialCode}`;
        user.contact.phone.number = this.tmpSettings.profileUserPhone;



        try {
            user.save();
            this.authService.updateUserSettings(this.tmpSettings);
            this.changeLanguage();
        } catch (er) {
            er = er as Error;
            this.alertService.show(AlertType.ERROR, this.messages['INVALID_FIELDS_MESSAGE'])
        }
    }

    changeLanguage(): void {
        this.translate.use(this.tmpSettings.languageCode);
    }

}
