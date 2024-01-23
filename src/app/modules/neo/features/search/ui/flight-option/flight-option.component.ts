import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ReservationService } from 'src/app/modules/neo/data-access/reservation.service';
import { Carrier } from 'src/app/modules/neo/models/carrier.model';
import { FlightOption } from 'src/app/modules/neo/models/flight-option.model';
import { AirSearchResponse } from 'src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model';

@Component({
    selector: 'app-flight-option',
    templateUrl: './flight-option.component.html',
    styleUrls: ['./flight-option.component.scss'],
})
export class FlightOptionComponent implements OnInit {
    progressWidth = '0%';
    selected!: boolean;
    @Input() resultId!: string;
    @Input() option!: FlightOption;
    @Output() flightSelectEvent: EventEmitter<FlightOption> = new EventEmitter<FlightOption>();


    constructor(
        private reservationService: ReservationService,
    ) { }

    ngOnInit() {
        this.reservationService.getSelectedFlights().subscribe({
            next: (flights: { [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }) => {
                this.selected = this.isOptionSelected();
            }
        })
    }

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

    isOptionSelected(): boolean {
        return this.reservationService.isOptionSelected(this.option.id) && (this.resultId === this.reservationService.activeResult);
    }

    @HostListener('click')
    onSelectionClick(): void {
        this.flightSelectEvent.emit(this.option);
    }

    range(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }

    onStopHover(index: number): void {
        if (index < 0) {
            this.progressWidth = '0%';
            return;
        }
        
        const widthPercentage = ((index + 1) / (this.numberOfStops + 1)) * 100;
        this.progressWidth = `${widthPercentage}%`;
    }
}
