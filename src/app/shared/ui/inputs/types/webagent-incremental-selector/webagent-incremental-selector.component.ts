import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-webagent-incremental-selector',
  templateUrl: './webagent-incremental-selector.component.html',
  styleUrls: ['./webagent-incremental-selector.component.scss']
})
export class WebagentIncrementalSelectorComponent {
  @Input() value: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 9;
  @Input() step: number = 1;

  increment() {
    if (this.value < this.max) {
      this.value += this.step;
    }
  }

  decrement() {
    if (this.value > this.min) {
      this.value -= this.step;
    }
  }
}
