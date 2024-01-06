import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-customizable-dropdown-input',
  templateUrl: './webagent-customizable-dropdown-input.component.html',
  styleUrls: ['./webagent-customizable-dropdown-input.component.scss']
})
export class WebagentCustomizableDropdownInputComponent extends WebagentBaseComponent {

  @Output() selectionChange = new EventEmitter<string>();
  selectedOption: string = "";
  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isDropdownOpen = false;
    this.selectionChange.emit(option);
  }
}

