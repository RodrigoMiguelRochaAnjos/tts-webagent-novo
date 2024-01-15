import { Component } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import * as moment from 'moment';

@Component({
  selector: 'app-webagent-date',
  templateUrl: './webagent-date.component.html',
  styleUrls: ['./webagent-date.component.scss']
})
export class WebagentDateComponent extends WebagentBaseComponent {
    public date: moment.Moment = moment();
}
