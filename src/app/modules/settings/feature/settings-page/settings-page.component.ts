import { Component, Input } from '@angular/core';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent {
	InputType = InputType;

    test: SelectedLocation = new SelectedLocation();
    test2: SelectedLocation = new SelectedLocation();

    test3: DateRange = new DateRange();
    testOld: string = "1234";
    testOld1: string = "123456";
    options: string[] = ["test", "test2"]

    switch: { [key: string]: boolean} = {
        'Option 1': false,
        'Option 2': false
    }

	showTestValue(): void {
		console.log(this.test3);
	}
}
