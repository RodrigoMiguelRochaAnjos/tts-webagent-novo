import { Component, OnInit } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import { DirectivesModule } from 'src/app/shared/directives/directive.module';
import { FieldLimitDirective } from 'src/app/shared/directives/field-limit.directive';

@Component({
  selector: 'app-webagent-cvv',
  templateUrl: './webagent-cvv.component.html',
  styleUrls: ['./webagent-cvv.component.scss'],
})
export class WebagentCvvComponent extends WebagentBaseComponent implements OnInit{

    constructor() {
        super();
    }
    
    ngOnInit(): void {
    }
}