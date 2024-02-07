import { Component, ContentChild, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { WebagentDropdownComponent } from '../webagent-dropdown/webagent-dropdown.component';

@Component({
  selector: 'webagent-option',
  templateUrl: './webagent-option.component.html',
  styleUrls: ['./webagent-option.component.scss']
})
export class WebagentOptionComponent {
    @HostBinding("class.show")
    visible: boolean = true;

    @Input() value?: string;

    getContent(): any {
        return this.elementRef.nativeElement.textContent.trim();
    }

    constructor(private elementRef: ElementRef, private parent: WebagentDropdownComponent) { }

    @HostListener('click', [])
    selectOption() {
        this.parent.selectOption(this);
    }

}
