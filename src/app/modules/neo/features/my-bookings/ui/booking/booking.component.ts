import { Component, Input } from '@angular/core';
import { BookingSummary, BookingSummaryResponse } from '../../models/booking-summary-response.model';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BookingSummaryService } from '../../data-access/booking-summary.service';

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
		private bookingSummaryService: BookingSummaryService
	) { }

	goToBooking(): void {
		this.router.navigate([`booking-info/${this.booking.bookingId}`]);
	}
}
