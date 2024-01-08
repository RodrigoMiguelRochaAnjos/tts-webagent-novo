import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_INPUT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WebagentBaseComponent),
    multi: true
}

@Component({
  selector: 'app-webagent-base',
  template: '',
  providers: [CUSTOM_INPUT_VALUE_ACCESSOR]
})
export class WebagentBaseComponent implements ControlValueAccessor{

    value?: any;
    disabled!: boolean;
    required!: boolean;
    pattern: string = ``;
    placeholder: string = "";
    min?: string;
    max?: string;

    writeValue(obj: any): void {
        this.value = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onChange: any = () => { };
    onTouched: any = () => { };

    update(){
        this.onChange(this.value);
        this.onTouched();
    }
}
