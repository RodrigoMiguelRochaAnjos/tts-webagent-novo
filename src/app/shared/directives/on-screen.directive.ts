import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from "@angular/core";

@Directive({
    selector: '[onScreen]'
})
export class OnScreenDirective implements OnInit, OnDestroy {
    @Output() onScreen: EventEmitter<{ isOnScreen: boolean, element: HTMLElement }> = new EventEmitter<{ isOnScreen: boolean, element: HTMLElement }>();

    private observer!: IntersectionObserver;

    constructor(private elementRef: ElementRef, private ngZone: NgZone) {}
    
    ngOnInit(): void {
        this.createObserver();
        this.observeElement();
    }
    
    ngOnDestroy(): void {
        this.disconnectObserver();
    }

    private createObserver(): void {
        this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            this.ngZone.run(() => {
                const isIntersecting = entries[0].isIntersecting;
                this.onScreen.emit({
                    isOnScreen: isIntersecting,
                    element: this.elementRef.nativeElement
                });

                if (isIntersecting) this.disconnectObserver();
            });
        });
    }

    private observeElement() : void {
        if(!this.elementRef.nativeElement) return;

        this.observer.observe(this.elementRef.nativeElement);
    }

    private disconnectObserver(): void {
        if(!this.observer) return;

        this.observer.disconnect();
    } 

}