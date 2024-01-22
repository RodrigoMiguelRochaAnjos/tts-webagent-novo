import { Component, Input } from '@angular/core';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import { countriesDialCodes } from 'src/app/shared/utils/countries-dial-codes.data';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent {
	InputType = InputType;
  patterns = patterns;
  countriesDialCodes = countriesDialCodes;

  fontSize: number = 5.5;
 
  countriesDialCodeOptions: string[] = [];

  ngOnInit() {
    this.countriesDialCodeOptions = Object.keys(this.countriesDialCodes);
  }
}
