import { Component, OnInit } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-number',
  templateUrl: './webagent-number.component.html',
  styleUrls: ['./webagent-number.component.scss']
})
export class WebagentNumberComponent extends WebagentBaseComponent implements OnInit{

    maxLimit: number = 9;
    minLimit: number = 9;

    constructor() {
        super();
    }

    ngOnInit(): void {
        if (this.isNumeric(this.max)) this.maxLimit = Number(this.max);
        if (this.isNumeric(this.min)) this.minLimit = Number(this.min);
    }
}
