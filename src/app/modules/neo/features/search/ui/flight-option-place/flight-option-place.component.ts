import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-flight-option-place',
    templateUrl: './flight-option-place.component.html',
    styleUrls: ['./flight-option-place.component.scss'],
})
export class FlightOptionPlaceComponent implements OnInit {

    @Input() origin!: string;
    @Input() destination!: string;

    constructor() { }

    ngOnInit() { }

}
