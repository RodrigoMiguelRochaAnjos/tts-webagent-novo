import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CheckboxFilterSelection } from '../../data-access/better-filter.service';


@Component({
    selector: 'app-neo-select',
    templateUrl: './neo-select.component.html',
    styleUrls: ['./neo-select.component.scss'],
})
export class NeoSelectComponent implements OnInit, AfterViewInit {

    @Input() options!: { value: string, label: string, selected: boolean }[] | CheckboxFilterSelection[] | undefined;

    @Output() public onSelectOption: EventEmitter<{ value: string, label: string, selected: boolean }[]> = new EventEmitter<{ value: string, label: string, selected: boolean }[]>();

    @ViewChild("selectWrapper", { static: false }) selectWrapper!: ElementRef;

    public open: boolean = false;
    private selectAll: boolean = false;
    public showTriangle: boolean = true;

    constructor() { }
    ngAfterViewInit(): void {
        this.selectWrapper.nativeElement.style.height = '0px';
    }

    ngOnInit() {
        this.checkOptions();

        if(this.options != null) {
            this.options = [
                { value: 'all', label: 'Select All', selected: this.selectAll },
                ...this.options
            ]
        }
    }

    select(option: { value: string, label: string, selected: boolean }, index: number) {
        if (index === 0 && this.options != null) {
            if (option.selected) {
                this.options.forEach((element: { value: string, label: string, selected: boolean }, index) => {
                    element.selected = false;
                })

            } else {
                this.options.forEach((element: { value: string, label: string, selected: boolean }, index) => {
                    element.selected = true;
                })
            }

            this.selectAll = option.selected;

        }

        option.selected = !option.selected;

        if(this.options != null) {
            this.options[index] = option;
    
            this.onSelectOption.emit(this.options);
        }

        this.checkOptions();
        this.refreshAllOption();
    }

    private checkOptions() {
        if(this.options == null) return;

        for (const option of this.options.slice(1)) {
            if (!option.selected) {
                this.selectAll = false;
                break;
            }
            this.selectAll = true;
        }
    }

    private refreshAllOption(): void {
        if (this.options == null) return;

        this.options[0] = { value: 'all', label: 'Select All', selected: this.selectAll };
    }

    get displayValue(): string {
        if (this.options == null) return "";

        const selection: string[] = [];

        this.options.forEach((element: { value: string, label: string, selected: boolean }, index: number) => {
            if (element.selected && index !== 0) {
                selection.push(element.value);
            }
        })

        let str : string= selection.join(", ");

        if(str.length > 19) str = `${str.slice(0, 19)} ...`;

        return str
    }

    toggle() {
        if (this.options == null) return;

        if (this.open) {
            this.selectWrapper.nativeElement.style.height = '0px';
            this.open = !this.open;
            this.rotateTriangle();

        } else {
            this.selectWrapper.nativeElement.style.height = `${this.options.length * 47}px`;
            this.open = !this.open;
            this.rotateTriangle();

        }

    }
    rotateTriangle() {
        this.showTriangle = !this.showTriangle;
    }
}
