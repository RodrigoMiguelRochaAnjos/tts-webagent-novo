import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Carrier } from 'src/app/modules/neo/models/carrier.model';
import { FlightOption } from 'src/app/modules/neo/models/flight-option.model';
import { AirSearchResponse } from 'src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model';

@Component({
    selector: 'app-flight-option',
    templateUrl: './flight-option.component.html',
    styleUrls: ['./flight-option.component.scss'],
})
export class FlightOptionComponent implements OnInit {

    @Input() result!: AirSearchResponse;
    @Input() option!: FlightOption;
    @Input() outbound!: boolean;

    @Output() flightSelectEvent: EventEmitter<{ [id: string]: FlightOption }> = new EventEmitter<{ [id: string]: FlightOption }>();


    constructor(
        // private reservationService: ReservationService
    ) { }

    ngOnInit() { }

    get airlinesLogos(): Carrier[] {
        const logos: Carrier[] = [];

        for (const segment of this.option.segments) {
            logos.push(segment.marketingCarrier);
        }

        const uniqueLogos: Iterable<Carrier> = new Set(logos);

        return [...uniqueLogos];
    }

    get numberOfStops(): number {
        return this.option.segments.length - 1;
    }

    get totalDuration(): string {
        let duration = '';

        const hours: number = Math.floor(this.option.duration / 60);
        if (hours > 0) {
            duration += hours + 'h';
        }

        const minutes: number = Math.floor(this.option.duration % 60);
        if (minutes > 0) {
            duration += minutes + 'm';
        }

        return duration;
    }

    get originCode(): string {
        return this.option.segments[0].origin.code;
    }

    get destinationCode(): string {
        return this.option.segments[this.option.segments.length - 1].destination.code;
    }

    get isOptionSelected(): boolean {
        return false;
        // return this.reservationService.isOptionSelected(
        //     this.result.id,
        //     this.option.id,
        //     this.outbound
        // );
    }

    @HostListener('click')
    onSelectionClick(): void {

        // this.reservationService.select(this.result, this.option, this.outbound ? 'OUTBOUNDS' : 'INBOUNDS');

        // let inbound: any = this.reservationService.selectionFlights['INBOUND'] ? this.reservationService.selectionFlights['INBOUND'] : null; 
        // let outbound: any = this.reservationService.selectionFlights['OUTBOUND'] ? this.reservationService.selectionFlights['OUTBOUND'] : null; 

        // this.flightSelectEvent.emit({
        //     'INBOUND': inbound,
        //     'OUTBOUND': outbound
        // });
    }
}
