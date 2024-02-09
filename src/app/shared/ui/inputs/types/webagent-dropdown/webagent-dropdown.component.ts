import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, HostBinding, Input, OnInit, Output, QueryList, forwardRef } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import { WebagentOptionComponent } from '../webagent-option/webagent-option.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_INPUT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WebagentDropdownComponent),
    multi: true
}

@Component({
    selector: 'webagent-dropdown',
    templateUrl: './webagent-dropdown.component.html',
    styleUrls: ['./webagent-dropdown.component.scss'],
    providers: [CUSTOM_INPUT_VALUE_ACCESSOR],
})
export class WebagentDropdownComponent implements ControlValueAccessor, AfterContentInit {
    isDropdownOpen: boolean = false;

    @Input() label?: string;
    
    @HostBinding("class.search")
    @Input() search: boolean = false;

    @HostBinding("class.ng-disabled")
    @Input() disabled: boolean = false;

    @ContentChildren(WebagentOptionComponent) options!: QueryList<WebagentOptionComponent>;

    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    selectedOption!: WebagentOptionComponent;

    constructor(
        private cdr: ChangeDetectorRef
    ){}

    ngAfterContentInit(): void {
        this.selectedOption = this.options.first;
        setTimeout(() => {
            if (this.options.first) this.selectedOption = this.options.first;
            this.onChangeCallback(this.options.first?.value);

        });
        
    }

    private onChangeCallback: (value: any) => void = () => { };
    private onTouchedCallback: () => void = () => { };

    writeValue(value: any): void {
        if(value == null) return;
        // Find the option with the specified value and set it as selected
        const selectedOption = this.options.find(option => option.value === value);
        if (selectedOption) {
            setTimeout(() => {
                this.selectedOption = selectedOption;
            })
        }

    }

    registerOnChange(callback: (value: any) => void): void {
        this.onChangeCallback = callback;
    }

    registerOnTouched(callback: () => void): void {
        this.onTouchedCallback = callback;
    }

    setDisabledState(isDisabled: boolean): void {
        // If you want to support disabling the input
        // Update the template accordingly
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    filterOptions(event: Event) {
        const element: HTMLInputElement = (event.target as HTMLInputElement);

        // Filter options based on the input text
        const filterValue = element.value.toLowerCase();
        this.options.forEach(option => {
            const optionContent: string = option.getContent().toLowerCase();
            const optionValue: string | undefined = option.value?.toLowerCase();
            
            option.visible = optionValue?.includes(filterValue) || optionContent.includes(filterValue);
        });

        this.isDropdownOpen = true;
    }

    selectOption(option: WebagentOptionComponent): void {
        this.isDropdownOpen = false;
        this.selectedOption = option;
        this.onChangeCallback(option?.value);
        this.change.emit(option?.value);
    }

    keepOpen(): void {
        this.isDropdownOpen = true;
    }

    selectFirstResult(event: KeyboardEvent) {
        if (event.key !== "Enter") return;

        const firstOption: WebagentOptionComponent | undefined = Array.from(this.options).filter((value) => value.visible)[0];

        if(firstOption == null) return;

        this.selectOption(firstOption);
    }
}
