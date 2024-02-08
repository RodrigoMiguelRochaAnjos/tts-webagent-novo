import { Component } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-checkbox-input',
  templateUrl: './webagent-checkbox-input.component.html',
  styleUrls: ['./webagent-checkbox-input.component.scss']
})
export class WebagentCheckboxInputComponent extends WebagentBaseComponent{
  isChecked: boolean = false;
}
