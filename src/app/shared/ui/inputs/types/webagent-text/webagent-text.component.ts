import { Component, OnInit } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import * as moment from 'moment';

@Component({
  selector: 'app-webagent-text',
  templateUrl: './webagent-text.component.html',
  styleUrls: ['./webagent-text.component.scss']
})
export class WebagentTextComponent extends WebagentBaseComponent implements OnInit{

    ngOnInit(): void {
    }
    
}
