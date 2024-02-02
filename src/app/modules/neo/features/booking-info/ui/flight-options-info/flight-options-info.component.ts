import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { AirSegment } from 'src/app/modules/neo/models/air-segment.model';
import { FlightOption } from 'src/app/modules/neo/models/flight-option.model';
import { Providers } from 'src/app/modules/neo/models/providers.enum';
import { Status } from 'src/app/modules/neo/models/status.enum';
import { BookingRef } from '../../../search/models/booking-ref.model';

@Component({
	selector: 'app-flight-options-info',
	templateUrl: './flight-options-info.component.html',
	styleUrls: ['./flight-options-info.component.scss'],
})
export class FlightOptionsInfoComponent  implements OnInit {
    @Input() options!: FlightOption[];
    @Input() bookingRefs!: Map<string, BookingRef>;
    @Input() errorMessage: boolean = false;


    Providers = Providers

	tmpBookingRefs!: Map<string, BookingRef>;

	constructor() {

    }

	ngOnInit(): void {
		this.tmpBookingRefs = Object.assign(new Map<string, BookingRef>(), this.bookingRefs);
	}


	getOrigDestLabel(option: FlightOption): string {
		let label: string = '';
		label = option.segments[0].origin.code;
		label +=
			' - ' +
			option.segments[option.segments.length - 1].destination.code;
		return label;
	}

	totalDuration(option: FlightOption): string {
		let duration: string = '';

		const hours: number = Math.floor(option.duration / 60);
		if (hours > 0) {
			duration += hours + 'h';
		}

		const minutes: number = Math.floor(option.duration % 60);
		if (minutes > 0) {
			duration += minutes + 'm';
		}

		return duration;
	}

	segmentDuration(segment: AirSegment): string {
		let duration: string = '';

		const hours: number = Math.floor(segment.duration / 60);
		if (hours > 0) {
			duration += hours + 'h';
		}

		const minutes: number = Math.floor(segment.duration % 60);
		if (minutes > 0) {
			duration += minutes + 'm';
		}

		return duration;
	}
    isSameDay(dateString1: string, dateString2: string): boolean {
        const date1 = new Date(dateString1);
        const date2 = new Date(dateString2);

        return (
            date1.getFullYear() == date2.getFullYear() &&
            date1.getMonth() == date2.getMonth() &&
            date1.getDate() == date2.getDate()
        )
    }
	toggleMessage(ref: BookingRef) {
        if(ref.status === Status.CONFIRMED) return;

        const errorMessages: string[] = ref.errors ? ref.errors : [];
        const warningMessages: string[] = ref.warnings ? ref.warnings : [];

        let message: string = `When trying to book the following flight, the flight retuned the following status message: ${ref.status} `;

        
        if (errorMessages.length > 0) message = message.concat(`with the following errors: ${errorMessages.join("\n")}`)

        if (warningMessages.length > 0) message = message.concat(`\nand the following warnings ${warningMessages.join("\n")}`)

		alert(message);

	}
}
