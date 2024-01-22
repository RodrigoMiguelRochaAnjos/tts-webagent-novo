import { Component, Input } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import { Step } from 'src/app/shared/models/knob.model';

@Component({
  selector: 'app-webagent-slider',
  templateUrl: './webagent-slider.component.html',
  styleUrls: ['./webagent-slider.component.scss']
})
export class WebagentSliderComponent extends WebagentBaseComponent {
	minValue: number = 0.5;
	maxValue: number = 2.5;

	constructor(){
		super();		
	}

	onSliderValueChange(newValue: number) {
		this.value = newValue;
		this.onChange(this.value);
		this.updateFontSize(newValue);
	  }
	
	  updateFontSize(fontSize: number) {
		// Implement logic to update font size on another page
		// For example, you might want to emit an event or call a service
		// that updates the font size on the other page.
		console.log('Updating font size:', fontSize);
	}

}
