import { Component } from '@angular/core';
import { WebagentInputComponent } from '../../webagent-input/webagent-input.component';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-dropdown',
  templateUrl: './webagent-dropdown.component.html',
  styleUrls: ['./webagent-dropdown.component.scss']
})
export class WebagentDropdownComponent extends WebagentBaseComponent{
    selectedOption: string = 'Select an option';
    isDropdownOpen: boolean = false;

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    selectOption(option: string): void {
        this.selectedOption = option;
        this.isDropdownOpen = false;
    }
}
