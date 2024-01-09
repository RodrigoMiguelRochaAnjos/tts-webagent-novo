import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    standalone: false,
    selector: '[fieldLimit]',
})
export class FieldLimitDirective {
    @Input() fieldLimit: number = 10; // You can set a default maximum length

    private oldValue: string = "";

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) onInput(event: any): void {
        const element: HTMLInputElement = event.target;
        let inputValue: string = element.value;
        
        if (element.type == "number" && /\D/g.test(event.data) && event.data != null) {
            event.target.value = this.oldValue.replace(/\D/g, "");
            return;
        }

        this.oldValue = inputValue;

        if (inputValue.length > this.fieldLimit) {
            // If the input exceeds the maximum length, truncate it
            event.target.value = inputValue.slice(0, this.fieldLimit);
        }
    }
}