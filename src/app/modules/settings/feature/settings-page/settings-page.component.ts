import { Component } from '@angular/core';
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
    testOld: string = "1234";
    // protected readonly CVV_PATTERN: RegExp = ;
    showTestValue(): void {
        console.log(this.test);
    }
}
