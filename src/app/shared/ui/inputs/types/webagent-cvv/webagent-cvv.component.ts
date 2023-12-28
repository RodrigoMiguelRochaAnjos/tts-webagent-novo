import { Component } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-cvv',
  templateUrl: './webagent-cvv.component.html',
  styleUrls: ['./webagent-cvv.component.scss']
})
export class WebagentCvvComponent extends WebagentBaseComponent{
  public readonly CVV_PATTERN: RegExp= /^\d{3,5}$/;
}