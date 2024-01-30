import { Component, Input, OnInit } from '@angular/core';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import { countriesDialCodes } from 'src/app/shared/utils/countries-dial-codes.data';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { Observable } from 'rxjs';
import { countriesCodes } from 'src/app/shared/utils/countries-codes.data';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit{
    InputType = InputType;
    patterns = patterns;
    countriesDialCodes = countriesDialCodes;
    countriesCodes = countriesCodes;

    countriesDialCodeOptions: string[] = [];
    countriesCodesOptions: string[] = [];


    private user$!: Observable<User>;

    constructor(
        private authService: AuthService
    ) {
        this.countriesCodesOptions = Object.keys(this.countriesCodes);
        this.countriesDialCodeOptions = Object.keys(this.countriesDialCodes);
        this.user$ = authService.getUser();
    }

    ngOnInit(): void {
        
    }
}
