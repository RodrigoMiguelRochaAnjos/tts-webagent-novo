import { Component } from '@angular/core';
import { WebagentInputComponent } from '../../webagent-input/webagent-input.component';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-autocomplete-dropdown',
  templateUrl: './webagent-autocomplete-dropdown.component.html',
  styleUrls: ['./webagent-autocomplete-dropdown.component.scss']
})
export class WebagentAutocompleteDropdownComponent extends WebagentBaseComponent{
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
