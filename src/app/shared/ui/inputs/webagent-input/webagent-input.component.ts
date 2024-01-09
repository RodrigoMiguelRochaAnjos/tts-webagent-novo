import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, HostBinding, Inject, InjectionToken, Input, OnInit, ViewChild, ViewContainerRef, forwardRef } from '@angular/core';
import { InputType } from '../input-type.enum';
import { WebagentDropdownComponent } from '../types/webagent-dropdown/webagent-dropdown.component';
import { WebagentTextComponent } from '../types/webagent-text/webagent-text.component';
import { WebagentBaseComponent } from '../types/webagent-base/webagent-base.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { WebagentLocationSearchComponent } from '../types/webagent-location-search/webagent-location-search.component';
import { WebagentDateComponent } from '../types/webagent-date/webagent-date.component';
import { WebagentDateRangeComponent } from '../types/webagent-date-range/webagent-date-range.component';
import { WebagentSwitchComponent } from '../types/webagent-switch/webagent-switch.component';
import { WebagentCvvComponent } from '../types/webagent-cvv/webagent-cvv.component';

const WRAPPER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WebagentInputComponent),
    multi: true,
};


@Component({
    selector: 'webagent-input',
    templateUrl: './webagent-input.component.html',
    styleUrls: ['./webagent-input.component.scss'],
    providers: [WRAPPER_VALUE_ACCESSOR]
})
export class WebagentInputComponent implements ControlValueAccessor, AfterViewInit, OnInit {
    @ViewChild('mutableComponentContainer', { read: ViewContainerRef }) private _container!: ViewContainerRef;
    
    @Input() type!: InputType;
    @Input() value?: any = "";
    @Input() label?: string;
    @Input() min?: string;
    @Input() max?: string;

    @HostBinding("class.ng-disabled")
    @Input() disabled: boolean = false;

    @Input() required: boolean = false;
    
    @HostBinding("class.ng-invalid")
    invalid: boolean = false;

    @Input() pattern: string = ``;
    @Input() placeholder: string = ``;
    @Input() options: string[] = [];
    
    constructor(
        private cdr: ChangeDetectorRef,
    ) {}
    ngOnInit(): void {

        this.invalid = this.required;
    }

    ngAfterViewInit(): void {
        this.writeValue(this.value);


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
        if(obj == null) return;

        this.value = obj;
        this.loadChildComponent();
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
                return WebagentDateRangeComponent;
            case InputType.DROPDOWN:
                return WebagentDropdownComponent;
            case InputType.LOCATION_SEARCH:
                return WebagentLocationSearchComponent;
            case InputType.SWITCH:
                return WebagentSwitchComponent;
            case InputType.CVV:
                return WebagentCvvComponent;
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
        componentRef.instance.options = this.options;

        componentRef.instance.writeValue(this.value);

        componentRef.instance.setDisabledState!(this.disabled);
        
        componentRef.instance.registerOnChange((value: any) => {
            this.onChange(value);

            this.value = value;
            
            const regex: RegExp = new RegExp(this.pattern);

            this.invalid = !regex.test(this.value);

            if(this.value == '') this.invalid = this.required;

        });

        componentRef.instance.registerOnTouched((value: any) => {
            this.onTouched(value);
        });

        return componentRef;
    }
}
