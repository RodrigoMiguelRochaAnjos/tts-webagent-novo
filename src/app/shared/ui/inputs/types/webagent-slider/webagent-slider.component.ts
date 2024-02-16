import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
    selector: 'webagent-slider',
    templateUrl: './webagent-slider.component.html',
    styleUrls: ['./webagent-slider.component.scss']
})
export class WebagentSliderComponent implements AfterViewInit{
    @Input() min = 0;
    @Input() max = 999999;
    @Input() steps?: number;
    @Input() value: { min: number, max: number} = {
        min: 0,
        max: this.max
    };
    @Output() valueChange = new EventEmitter<{ min: number, max: number }>();

    @ViewChild("minInput") minInput!: ElementRef<HTMLInputElement>;
    @ViewChild("maxInput") maxInput!: ElementRef<HTMLInputElement>;

    thumbLeft = 0;
    thumbRight = 0;
    private pressed: boolean = false;

    @ViewChild("customSlider") customSlider!: ElementRef<HTMLElement>;

    private threshHolds: number[] = [];

    private listenerFn = () => { };
    private mouseupFn = () => { };

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit(): void {
        this.minInput.nativeElement.style.width = `${this.minInput.nativeElement.value.toString().length}ch`;
        this.maxInput.nativeElement.style.width = `${this.maxInput.nativeElement.value.toString().length}ch`;
        
        if(this.steps){
            const stepSize = 100 / this.steps;
            this.threshHolds = [0];
    
            for (let i = 0; i < this.steps; i++) {
                const start = i * stepSize;
                const end = (i + 1) * stepSize;
    
                this.threshHolds.push(end);
            }
        }
    }

    calculateSteps(maxValue: number, numberOfSteps: number): number[] {
        
        const steps: number[] = [];

        

        return steps;
    }

    onThumbDown(event: MouseEvent, cursor: 'LEFT' | 'RIGHT') {
        const rect = this.customSlider.nativeElement.getBoundingClientRect();
        // const rect = this.elementRef.nativeElement.getBoundingClientRect();

        event.preventDefault();

        this.pressed = true;

        switch(cursor){
            case 'LEFT':
                this.thumbLeft = ((event.x - rect.left) / (this.customSlider.nativeElement.offsetWidth)) * 100;
                break;
            case 'RIGHT':
                this.thumbRight = 100 - (((event.x - rect.left) / (this.customSlider.nativeElement.offsetWidth)) * 100);
                break;
        }

        this.listenerFn = this.renderer.listen('document', 'mousemove', (e) => this.onMouseMove(e, cursor));
        this.mouseupFn = this.renderer.listen('document', 'mouseup', (e) => this.onMouseUp(e, cursor));
    }

    onMouseMove(event: MouseEvent, cursor: 'LEFT' | 'RIGHT') {
        if (!this.pressed) return;
        const rect = this.customSlider.nativeElement.getBoundingClientRect();
        // const rect = this.elementRef.nativeElement.getBoundingClientRect();
        event.preventDefault();

        let distanceLeft: number = ((event.x - rect.left) / (this.customSlider.nativeElement.offsetWidth)) * 100;
        let distanceRight: number = 100 - (((event.x - rect.left) / (this.customSlider.nativeElement.offsetWidth)) * 100);

        if (cursor === 'LEFT' && distanceLeft > 100 - this.thumbRight) {
            distanceLeft = 100 - this.thumbRight;
            return;
        }
        if (cursor === 'RIGHT' && distanceRight > 100 - this.thumbLeft) return;

        if (distanceLeft < 0) {
            distanceLeft = 0;
        }
        if (distanceLeft > 100) {
            distanceLeft = 100;
        } 

        if (distanceRight < 0) {
            distanceRight = 0;
        }
        if (distanceRight > 100) {
            distanceRight = 100;
        }

        let closestThresholdLeft: number | undefined;
        if(this.steps){
            closestThresholdLeft = this.threshHolds.reduce((closest, threshold) => {
                const currentDifference = Math.abs(threshold - distanceLeft);
                const closestDifference = Math.abs(closest - distanceLeft);
                return currentDifference < closestDifference ? threshold : closest;
            });
        }

        let closestThresholdRight: number | undefined;
        if (this.steps) {
            closestThresholdRight = this.threshHolds.reduce((closest, threshold) => {
                const currentDifference = Math.abs(threshold - distanceRight);
                const closestDifference = Math.abs(closest - distanceRight);
                return currentDifference < closestDifference ? threshold : closest;
            });
        }

        switch (cursor) {
            case 'LEFT':
                if (closestThresholdLeft != null && distanceLeft > closestThresholdLeft){
                    this.thumbLeft = closestThresholdLeft;
                } else if(closestThresholdLeft == null) {
                    this.thumbLeft = distanceLeft;
                }
                break;
            case 'RIGHT':
                if (closestThresholdRight != null && distanceRight >= closestThresholdRight) {
                    this.thumbRight = closestThresholdRight;
                    break;
                } else if (closestThresholdRight == null) {
                    this.thumbRight = distanceRight;
                }
                break;
        }

        this.value.min = (this.max / 100) * this.thumbLeft;
        this.value.max = this.max - ((this.max / 100) * this.thumbRight);
        this.valueChange.emit(this.value);

        this.minInput.nativeElement.style.width = `${this.minInput.nativeElement.value.toString().length}ch`;
        this.maxInput.nativeElement.style.width = `${this.maxInput.nativeElement.value.toString().length}ch`;


    }

    onMouseUp(event: MouseEvent, cursor: 'LEFT' | 'RIGHT') {

        this.pressed = false;

        this.listenerFn();
        this.mouseupFn();


    }

    manageSize(event: Event) : void {
        const eventTarget: EventTarget | null = event.target;

        if(eventTarget == null) return;

        const element: HTMLInputElement = eventTarget as HTMLInputElement;

        if(element.value.toString().length <= 3) {
            element.style.width = `3ch`;
            return;
        }

        element.style.width = `${element.value.toString().length}ch`;
    }

    setValue(event: KeyboardEvent, type: 'MIN' | 'MAX') {
        if(event.key !== "Enter") return;
        switch(type){
            case 'MIN':
                if (Number((event.target as HTMLInputElement).value) > this.max || Number((event.target as HTMLInputElement).value) < this.min) {
                    this.value.min = 0;
                    (event.target as HTMLInputElement).value = "0.00";
                    this.minInput.nativeElement.style.width = `4ch`;
                    return;
                }

                this.value.min = Number((event.target as HTMLInputElement).value);
                this.thumbLeft = (this.value.min / this.max) * 100;

                this.minInput.nativeElement.style.width = `${this.minInput.nativeElement.value.toString().length + 4}ch`;
                break;
            case 'MAX':
                if (Number((event.target as HTMLInputElement).value) > this.max  || Number((event.target as HTMLInputElement).value) < this.min) {
                    this.value.max = this.max;
                    this.maxInput.nativeElement.style.width = `4ch`;
                    return;
                }

                this.value.max = Number((event.target as HTMLInputElement).value);
                this.thumbRight = 100 - (this.value.max / this.max) * 100;

                this.maxInput.nativeElement.style.width = `${this.maxInput.nativeElement.value.toString().length + 4}ch`;

                break;
        }
    }
}
