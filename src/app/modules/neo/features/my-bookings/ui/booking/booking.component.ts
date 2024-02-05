import { Component, Input } from '@angular/core';
import { BookingSummary, BookingSummaryResponse } from '../../models/booking-summary-response.model';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BookingService } from '../../../checkout/data-access/booking.service';

@Component({
	selector: 'app-booking',
	templateUrl: './booking.component.html',
	styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

	@Input() public booking!: BookingSummary;

	moment = moment;

	constructor(
		private router: Router,
		private bookingSummaryService: BookingService
	) { }

	goToBooking(): void {
		this.router.navigate([`neo/booking-info/${this.booking.bookingId}`]);
	}
}
