import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, QueryList, ViewChild, forwardRef } from '@angular/core';
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
    private value: any;

    @Input() label?: string;
    
    @HostBinding("class.search")
    @Input() search: boolean = false;

    @HostBinding("class.ng-disabled")
    @Input() disabled: boolean = false;

    @ContentChildren(WebagentOptionComponent) options!: QueryList<WebagentOptionComponent>;

    @ViewChild("dropdownList") dropdownList!: ElementRef<HTMLDivElement>;

    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    optionIndex: number = -1;

    selectedOption!: WebagentOptionComponent;

    constructor(
        private cdr: ChangeDetectorRef
    ){}

    ngAfterContentInit(): void {
        this.selectedOption = this.options.first;

        this.options?.changes?.subscribe(() => {
            this.selectedOption = this.options.first;

            if (this.value != null) {
                const selectedOption = this.options.find(option => option.value === this.value);

                if (selectedOption) {
                    this.selectedOption = selectedOption;
                }
            }
            this.onChangeCallback(this.selectedOption.value)
        });
    }

    private onChangeCallback: (value: any) => void = () => { };
    private onTouchedCallback: () => void = () => { };

    writeValue(value: any): void {
        this.value = value;
        if(value == null) return;
        // Find the option with the specified value and set it as selected
        const selectedOption = this.options.find(option => option.value === value);
        if (selectedOption) {
            setTimeout(() => {
                this.selectedOption = selectedOption;
                this.onChangeCallback(value);

            }, 200)
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

        this.optionIndex = -1;
        this.options.forEach((option: WebagentOptionComponent, index: number) => {
            option.selected = false;
        });
    }

    @HostListener('keyup', ["$event"])
    navigationHandler(event: KeyboardEvent): void {
        switch(event.key) {
            case "Enter":
                this.handleEnterPressed();
                break;
            case "ArrowDown":
                this.handleArrowDown();
                break;
            case "ArrowUp":
                this.handleArrowUp();
                break;
        }
    }

    handleEnterPressed(): void {
        let option: WebagentOptionComponent | undefined = this.options.filter((option: WebagentOptionComponent) => option.visible)[this.optionIndex];

        if (option == null) {
            option = Array.from(this.options).filter((value) => value.visible)[0];
        }

        if(option == null) return;

        this.selectOption(option);
    }

    handleArrowDown(): void {
        if (this.optionIndex >= this.options.length - 1) return;
        console.log(this.optionIndex);

        this.optionIndex++;

        this.options.forEach((option: WebagentOptionComponent, index: number) => {
            option.selected = false;
        });

        const opt: WebagentOptionComponent | undefined = this.options.filter((option: WebagentOptionComponent) => option.visible)[this.optionIndex];

        if(opt == null) return;

        opt.selected = true;
        this.scrollToElement()
    }

    private scrollToElement() {
        const element: WebagentOptionComponent | undefined = this.options.filter((option: WebagentOptionComponent) => option.visible)[this.optionIndex];

        if(element == null) return;

        // Calculate the scroll position to center the element
        const offsetTop = element.getElementRef().nativeElement.offsetTop;
        const windowHeight = this.dropdownList.nativeElement.clientHeight;
        const elementHeight = element.getElementRef().nativeElement.offsetHeight;

        const targetScrollPosition = offsetTop - (windowHeight - elementHeight) / 2;

        // Scroll to the calculated position
        this.dropdownList.nativeElement.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth', // Optional: Add smooth scrolling effect
        });
    }

    handleArrowUp(): void {
        if (this.optionIndex <= 0) return;

        this.optionIndex--;

        this.options.forEach((option: WebagentOptionComponent, index: number) => {
            option.selected = false;
        });

        const opt: WebagentOptionComponent | undefined = this.options.filter((option: WebagentOptionComponent) => option.visible)[this.optionIndex];

        if (opt == null) return;

        opt.selected = true;
        this.scrollToElement();
    }

    selectOption(option: WebagentOptionComponent): void {
        this.isDropdownOpen = false;
        this.selectedOption = option;
        this.writeValue(option.value);
        this.change.emit(option?.value);
        this.onChangeCallback(option?.value)
    }

    keepOpen(): void {
        this.isDropdownOpen = true;
    }
}
