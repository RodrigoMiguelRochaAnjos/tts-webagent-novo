import { Component, OnInit } from '@angular/core';
import { WebagentInputComponent } from '../../webagent-input/webagent-input.component';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';

@Component({
  selector: 'app-webagent-dropdown',
  templateUrl: './webagent-dropdown.component.html',
  styleUrls: ['./webagent-dropdown.component.scss']
})
export class WebagentDropdownComponent extends WebagentBaseComponent implements OnInit{
    isDropdownOpen: boolean = false;
    
    ngOnInit(): void {
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    selectOption(option: string): void {
        this.value = option;
        this.isDropdownOpen = false;

        this.update();
    }
}
