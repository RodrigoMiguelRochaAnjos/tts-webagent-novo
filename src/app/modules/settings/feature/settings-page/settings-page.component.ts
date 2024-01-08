import { Component, Input } from '@angular/core';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent {
	InputType = InputType;

	switch : { [key: string]: boolean } = { 'ROUNDTRIP': false, 'ONEWAY': true };

	currentState = 'oneway';
	test: SelectedLocation = new SelectedLocation();
	test2: SelectedLocation = new SelectedLocation();
	testOld: string = "1234";

	showTestValue(): void {
		console.log(this.test);
	}

	onStateChanged(newState: any) {
		this.currentState = newState;
		console.log("Current state: ", this.currentState);
	}
}
