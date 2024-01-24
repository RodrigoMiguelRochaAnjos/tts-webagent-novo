import { Component, Input, OnInit } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
    selector: 'app-webagent-incremental-selector',
    templateUrl: './webagent-incremental-selector.component.html',
    styleUrls: ['./webagent-incremental-selector.component.scss']
})
export class WebagentIncrementalSelectorComponent extends WebagentBaseComponent implements OnInit {
    step: number = 1;

    maxLimit: number = 9;
    minLimit: number = 0;

    ngOnInit(): void {
        if (this.isNumeric(this.max)) this.maxLimit = Number(this.max);
        if (this.isNumeric(this.min)) this.minLimit = Number(this.min);

        this.value = 0;
    }

    increment() {
        if (this.value >= this.maxLimit) return;

        this.value += this.step;
        this.update()
    }

    decrement() {
        if (this.value <= this.minLimit) return;
        
        this.value -= this.step;
        this.update()
    }
}
