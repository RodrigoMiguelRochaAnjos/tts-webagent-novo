import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: '[autoFocus]'
})
export class AutoFocusDirective {
    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        this.el.nativeElement.focus();
    }
}