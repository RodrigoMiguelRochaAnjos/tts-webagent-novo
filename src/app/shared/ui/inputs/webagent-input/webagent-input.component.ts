import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, EventEmitter, HostBinding, Inject, InjectionToken, Input, OnInit, Output, ViewChild, ViewContainerRef, forwardRef } from '@angular/core';
import { InputType } from '../input-type.enum';
import { WebagentDropdownComponent } from '../types/webagent-dropdown/webagent-dropdown.component';
import { WebagentTextComponent } from '../types/webagent-text/webagent-text.component';
import { WebagentBaseComponent } from '../types/webagent-base/webagent-base.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { WebagentLocationSearchComponent } from '../types/webagent-location-search/webagent-location-search.component';
import { WebagentDateComponent } from '../types/webagent-date/webagent-date.component';
import { WebagentDateRangeComponent } from '../types/webagent-date-range/webagent-date-range.component';
import { WebagentIncrementalSelectorComponent } from '../types/webagent-incremental-selector/webagent-incremental-selector.component';
import { WebagentSwitchComponent } from '../types/webagent-switch/webagent-switch.component';
import { WebagentCvvComponent } from '../types/webagent-cvv/webagent-cvv.component';
import { WebagentSearchComponent } from '../types/webagent-search/webagent-search.component';
import { WebagentPasswordComponent } from '../types/webagent-password/webagent-password.component';
import { Theme } from '../theme.enum';
import { WebagentTextDateInputComponent } from '../types/webagent-text-date-input/webagent-text-date-input.component';
import { WebagentSliderComponent } from '../types/webagent-slider/webagent-slider.component';

const WRAPPER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WebagentInputComponent),
    multi: true,
};


@Component({
    selector: 'webagent-input',
    templateUrl: './webagent-input.component.html',
    styleUrls: ['./webagent-input.component.scss'],
    providers: [WRAPPER_VALUE_ACCESSOR],
})
export class WebagentInputComponent implements ControlValueAccessor, AfterViewInit, OnInit {
    @ViewChild('mutableComponentContainer', { read: ViewContainerRef }) private _container!: ViewContainerRef;
    
    @HostBinding("class.hide-default")
    @Input() hideDefault: boolean = false;
    @Input() type!: InputType;
    @Input() value?: any = "";
    @Input() label?: string;
    @Input() min?: string;
    @Input() max?: string;
    @Input() step?: number = .1;
    @Input() theme: Theme = Theme.DEFAULT;

    @HostBinding("class.ng-disabled")
    @Input() disabled: boolean = false;

    @Input() required: boolean = false;
    
    @HostBinding("class.ng-invalid")
    invalid: boolean = false;

    @Input() pattern: string = ``;
    @Input() placeholder: string = ``;
    @Input() options: string[] = [];
    
    @HostBinding("class")
    get classForTheme(): string {
        return this.theme;
    }



    private loaded: Promise<void> = Promise.resolve();
    

    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {

        this.invalid = this.required;
    }

    ngAfterViewInit(): void {
        this.writeValue(this.value);

        this.loaded = Promise.resolve();

        this.cdr.detectChanges();
    }

    onChange: any = () => { };
    onTouched: any = () => { };
    
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    writeValue(obj: any): void {
        this.loaded.then(() => {
            this.value = obj;

            this.loadChildComponent();
        })
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    getChildComponentType(): any {
        switch (this.type) {
            case InputType.TEXT:
                return WebagentTextComponent;
            case InputType.DATE:
                return WebagentDateComponent;
            case InputType.DATE_RANGE:
                this.hideDefault = true;

                return WebagentDateRangeComponent;
            case InputType.DROPDOWN:
                return WebagentDropdownComponent;
            case InputType.LOCATION_SEARCH:
                return WebagentLocationSearchComponent;
            case InputType.INCREMENTAL_SELECTOR:
                return WebagentIncrementalSelectorComponent;
            case InputType.SWITCH:
                this.hideDefault = true;

                return WebagentSwitchComponent;
            case InputType.CVV:
                return WebagentCvvComponent;
            case InputType.SEARCH:
                return WebagentSearchComponent;
            case InputType.PASSWORD:
                return WebagentPasswordComponent;
            case InputType.TEXT_DATE_INPUT:
                return WebagentTextDateInputComponent;
            case InputType.SLIDER:
                return WebagentSliderComponent;
            default:
                throw new Error("Invalid input type");
        }
    }

    loadChildComponent(): ComponentRef<any> {
        this._container.clear();

        const componentType = this.getChildComponentType();
        const componentRef: ComponentRef<WebagentBaseComponent> = this._container.createComponent(componentType);

        componentRef.instance.required = this.required;
        componentRef.instance.pattern = this.pattern;
        componentRef.instance.placeholder = this.placeholder;
        componentRef.instance.min = this.min;
        componentRef.instance.max = this.max;
        componentRef.instance.step = this.step;
        componentRef.instance.options = this.options;
        componentRef.instance.theme = this.theme;

        componentRef.instance.writeValue(this.value);

        componentRef.instance.setDisabledState!(this.disabled);
        
        componentRef.instance.registerOnChange((value: any) => {
            this.onChange(value);

            this.value = value;
            
            const regex: RegExp = new RegExp(this.pattern);

            this.invalid = !regex.test(this.value);

            if(this.value == '') this.invalid = this.required;

            this.change.emit(value);
        });

        componentRef.instance.registerOnTouched((value: any) => {
            this.onTouched(value);
        });

        return componentRef;
    }
}
