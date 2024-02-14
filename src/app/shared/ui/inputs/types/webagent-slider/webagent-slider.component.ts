import { AfterContentInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
    selector: 'webagent-slider',
    templateUrl: './webagent-slider.component.html',
    styleUrls: ['./webagent-slider.component.scss']
})
export class WebagentSliderComponent {
    @Input() min = 0;
    @Input() max = 999999;
    @Input() minValue = 0;
    @Input() maxValue = this.max;
    @Output() valueChange = new EventEmitter<number>();

    @ViewChild("minInput") minInput!: ElementRef<HTMLInputElement>;
    @ViewChild("maxInput") maxInput!: ElementRef<HTMLInputElement>;

    thumbLeft = 0;
    thumbRight = 0;
    private pressed: boolean = false;

    private listenerFn = () => { };
    private mouseupFn = () => { };

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }



    onThumbDown(event: MouseEvent, cursor: 'LEFT' | 'RIGHT') {
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        event.preventDefault();

        this.pressed = true;

        switch(cursor){
            case 'LEFT':
                this.thumbLeft = ((event.x - rect.left) / (this.elementRef.nativeElement.offsetWidth)) * 100;
                break;
            case 'RIGHT':
                this.thumbRight = 100 - (((event.x - rect.left) / (this.elementRef.nativeElement.offsetWidth)) * 100);
                break;
        }

        this.listenerFn = this.renderer.listen('document', 'mousemove', (e) => this.onMouseMove(e, cursor));
        this.mouseupFn = this.renderer.listen('document', 'mouseup', (e) => this.onMouseUp(e, cursor));
    }

    onMouseMove(event: MouseEvent, cursor: 'LEFT' | 'RIGHT') {
        if (!this.pressed) return;
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        event.preventDefault();

        let distanceLeft: number = ((event.x - rect.left) / (this.elementRef.nativeElement.offsetWidth)) * 100;
        let distanceRight: number = 100 - (((event.x - rect.left) / (this.elementRef.nativeElement.offsetWidth)) * 100);

        if (distanceLeft < 0) {
            distanceLeft = 0;
        }
        if (distanceLeft > 100) {
            distanceLeft = 98.6;
        } 

        if (distanceRight < 0) {
            distanceRight = 0;
        }
        if (distanceRight > 100) {
            distanceRight = 98.6;
        } 

        switch (cursor) {
            case 'LEFT':
                this.thumbLeft = distanceLeft;
                break;
            case 'RIGHT':
                this.thumbRight = distanceRight;
                break;
        }

        this.minValue = (this.max / 100) * this.thumbLeft;
        this.maxValue = this.max - ((this.max / 100) * this.thumbRight);
        this.valueChange.emit(this.minValue);

    }

    onMouseUp(event: MouseEvent, cursor: 'LEFT' | 'RIGHT') {

        this.pressed = false;

        this.listenerFn();
        this.mouseupFn();


    }
}
