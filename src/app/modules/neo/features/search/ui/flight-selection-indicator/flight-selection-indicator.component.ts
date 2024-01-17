import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-flight-selection-indicator',
	templateUrl: './flight-selection-indicator.component.html',
	styleUrls: ['./flight-selection-indicator.component.scss'],
})
export class FlightSelectionIndicatorComponent {
	@Input() selected: boolean = false;

	constructor() {}
}
