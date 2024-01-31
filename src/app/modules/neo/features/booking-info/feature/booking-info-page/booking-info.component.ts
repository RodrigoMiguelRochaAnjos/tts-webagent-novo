import { Component } from '@angular/core';
import { AirBooking } from 'src/app/shared/models/air-booking.model';
import { Providers } from '../../../../models/providers.enum';
import { FlightOption } from '../../../../models/flight-option.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BookingSummaryService } from '../../../my-bookings/data-access/booking-summary.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-booking-info',
	templateUrl: './booking-info.component.html',
	styleUrls: ['./booking-info.component.scss']
})
export class BookingInfoComponent {

	private reservationCancelled = false;
	private reservationIssued = false;

	booking: AirBooking = new AirBooking();


	booking$!: Observable<AirBooking>;
	constructor(
		private route: ActivatedRoute,
		private bookingSummaryService: BookingSummaryService,

	) {
		const id: string | null = this.route.snapshot.paramMap.get("id");

		if (id == null) return;

		this.booking$ = this.bookingSummaryService.getBooking();

		this.bookingSummaryService.getBookingSummaryById(id);

		this.booking$.subscribe((booking: AirBooking) => {
			this.booking = booking
		});
	}

	getProviderByKey(key: string): string {
		if (key === Providers.XMLSELECT) return "GDS";

		const flight: FlightOption | undefined = this.getFlightBySearchId(key);

		if (flight == undefined) return "";

		return `(${flight.segments[0].marketingCarrier.code})${flight.segments[0].marketingCarrier.name}`
	}

	getFlightBySearchId(searchId: string): FlightOption | undefined {
		for (const flight of this.booking.flights) {
			if (flight.searchId != searchId) continue;

			return flight;
		}

		return undefined;
	}

	get hasErrors(): boolean {
		return this.booking.errors && this.booking.errors.length > 0;
	}

	get showButtons(): boolean {
		if(this.booking.flights == null) return false;
		
		for (let flight of (this.booking.flights as FlightOption[])) {
			if (flight.provider == Providers.TRAVELFUSION) return false;
		}

		return !this.reservationCancelled && !this.reservationIssued;
	}

	get startDate(): string {
		if(!this.booking.flights || this.booking.flights.length <= 0) return '';

		if(!this.booking.flights[0].segments || this.booking.flights[0].segments.length <= 0) return '';

		return this.booking.flights[0].segments[0].departureDatetime;
	}

	// async emitTicket(): Promise<void> {
	// 	// this.statisticsService.addClientStat(clientStatisticsSources.neoIssueTicket);

	// 	let message;
	// 	this.translate.stream('NEO_CONFIRM_ISSUE').subscribe((text: string) => message = text);

	// 	this.alertService.show(AlertType.WARNING, message).subscribe((action: AlertAction) => {
	// 		if (action === AlertAction.WAITING) return;

	// 		switch (action) {
	// 			case AlertAction.EXECUTE:
	// 				for (const [key, value] of Object.entries(this.booking.bookingRefs)) {
	// 					const bookingRef = value as BookingRef
	// 					this.neoRestService
	// 						.post(emitTicketEndpoint + '?pnr=' + bookingRef.bookingCode, {})
	// 						.toPromise()
	// 						.then(
	// 							async (response) => {
	// 								await this.utilitiesService.dismissLoading();
	// 								this.translate
	// 									.stream('TICKET_ISSUED_SUCCESSFULLY')
	// 									.subscribe((text: string) => {
	// 										alert(text);
	// 									});
	// 								this.reservationIssued = true;
	// 							},
	// 							async (error) => {
	// 								this.reservationIssued = false;
	// 								await this.utilitiesService.dismissLoading();
	// 								this.neoRestService.handleError(error);
	// 								this.translate
	// 									.stream('TICKET_ISSUE_FAILED')
	// 									.subscribe((text: string) => {
	// 										alert(text);
	// 									});
	// 							}
	// 						);
	// 				}
	// 				break;
	// 			case AlertAction.CANCEL:
	// 				return;
	// 		}
	// 	})

	// 	dialogRef.afterClosed().subscribe(async result => {
	// 		if (result === true) {
	// 			await this.utilitiesService.showLoading();

	// 			for (const [key, value] of Object.entries(this.booking.bookingRefs)) {


	// 			}
	// 		});
	// }

	// async cancel(): Promise<void> {
	// 	this.statisticsService.addClientStat(clientStatisticsSources.neoCancelBooking);

	// 	let message;
	// 	this.translate.stream('NEO_CONFIRM_CANCELLATION').subscribe((text: string) => message = text);
	// 	const dialogRef = this.dialog.open(ConfirmDialogComponent, {
	// 		disableClose: true,
	// 		data: { message }
	// 	});
	// 	dialogRef.afterClosed().subscribe(async result => {
	// 		if (result === true) {
	// 			await this.utilitiesService.showLoading();


	// 			for (const [key, value] of Object.entries(this.booking.bookingRefs)) {

	// 				const bookingRef = value as BookingRef

	// 				this.neoRestService
	// 					.delete(cancelBookingEndpoint + '?pnr=' + bookingRef.bookingCode)
	// 					.toPromise()
	// 					.then(
	// 						async (res: any) => {
	// 							this.booking.status = 'CANCELLED';
	// 							this.booking.flights.forEach(item => {
	// 								for (const item1 of item.segments) {
	// 									item1.status = Status.CANCELLED;
	// 								}
	// 							});

	// 							await this.utilitiesService.dismissLoading();

	// 							if (res != null && res.status === 'SUCCESS') {
	// 								this.reservationCancelled = true;
	// 								this.translate
	// 									.stream('CANCELED_BOOKING_SUCCESSFULLY')
	// 									.subscribe((text: string) => {
	// 										alert(text);
	// 									});
	// 							} else {
	// 								this.translate
	// 									.stream('CANCEL_BOOKING_FAILED')
	// 									.subscribe((text: string) => {
	// 										alert(text);
	// 									});
	// 							}
	// 						}).catch(async (error: Error) => {
	// 							this.reservationCancelled = false;

	// 							await this.utilitiesService.dismissLoading();

	// 						});

	// 			}
	// 		}
	// 	});
	// }
}
