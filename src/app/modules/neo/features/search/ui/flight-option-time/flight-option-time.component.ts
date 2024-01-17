import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-flight-option-time',
    templateUrl: './flight-option-time.component.html',
    styleUrls: ['./flight-option-time.component.scss'],
})
export class FlightOptionTimeComponent implements OnInit {
    @Input() timeDeparture!: string;
    @Input() timeArrival!: string;
    public daysDifference!: number;

    constructor() { }

    ngOnInit() {
        const timeDiff = Math.abs(new Date(this.timeDeparture).getTime() - new Date(this.timeArrival).getTime());
        this.daysDifference = Math.floor(timeDiff / (1000 * 3600 * 24));
    }

}
