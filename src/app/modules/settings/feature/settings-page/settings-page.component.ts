import { Component, Input, OnInit } from '@angular/core';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import { countriesDialCodes } from 'src/app/shared/utils/countries-dial-codes.data';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { Observable } from 'rxjs';
import { Settings } from 'src/app/modules/home/models/settings.model';

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

    constructor(
        private authService: AuthService
    ) {
        this.countriesDialCodeOptions = Object.keys(this.countriesDialCodes);
        this.user$ = this.authService.getUser();
    }

    ngOnInit(): void {
        this.user$.subscribe((user: User) => {
            console.log("User settings: ",user.settings);
            this.oldSettings = user.settings ? user.settings : new Settings();
            this.tmpSettings = user.settings ? user.settings : new Settings();
        })
    }

    get canSave() : boolean {
        console.log("can save? ",JSON.stringify(this.oldSettings) !== JSON.stringify(this.tmpSettings))
        return JSON.stringify(this.oldSettings) !== JSON.stringify(this.tmpSettings);
    }
}
