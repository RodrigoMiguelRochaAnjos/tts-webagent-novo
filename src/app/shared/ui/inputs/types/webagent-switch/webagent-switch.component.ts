import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-switch',
  templateUrl: './webagent-switch.component.html',
  styleUrls: ['./webagent-switch.component.scss']
})
export class WebagentSwitchComponent extends WebagentBaseComponent implements OnInit {

  constructor(){
    super();
  }
  
  ngOnInit(): void {
    
    if(!this.isValidValue()) throw new Error("Invalid format should be { [key: string]: boolean }");
  }

  public getSwitchValues(): string[] {
    return Object.keys(this.value);
  }

  private isValidValue(): boolean {
    return Object.values(this.value).every((value) => typeof value === 'boolean') && Object.keys(this.value).every((value) => typeof value === 'string');
  }

  changeSelection(key: string): void {
    Object.keys(this.value).forEach((val: string) => {
      this.value[val] = false;
    });

    this.value[key]= true;
  }
}
