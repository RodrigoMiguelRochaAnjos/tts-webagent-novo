import { Component } from '@angular/core';
import { AirBooking } from 'src/app/shared/models/air-booking.model';
import { Providers } from '../../../../models/providers.enum';
import { FlightOption } from '../../../../models/flight-option.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BookingService } from '../../../checkout/data-access/booking.service';

@Component({
	selector: 'app-booking-info',
	templateUrl: './booking-info.component.html',
	styleUrls: ['./booking-info.component.scss']
})
export class BookingInfoComponent {

	private reservationCancelled = false;
	private reservationIssued = false;

	booking$!: Observable<AirBooking>;
	constructor(
		private route: ActivatedRoute,
		private bookingSummaryService: BookingService,

	) {
		const id: string | null = this.route.snapshot.paramMap.get("id");

		this.booking$ = this.bookingSummaryService.getBooking();
		
        if (id == null) return;

		this.bookingSummaryService.getBookingSummaryById(id);
	}

	getProviderByKey(key: string): string {
		if (key === Providers.XMLSELECT) return "GDS";

		const flight: FlightOption | undefined = this.getFlightBySearchId(key);

		if (flight == undefined) return "";

		return `(${flight.segments[0].marketingCarrier.code})${flight.segments[0].marketingCarrier.name}`
	}

	getFlightBySearchId(searchId: string): FlightOption | undefined {
        let flightFound: FlightOption | undefined;

        this.booking$.subscribe((booking: AirBooking) => {
            if(!booking.flights) return;

            for (const flight of booking.flights) {
                if (flight.searchId != searchId) continue;
    
                flightFound = flight;
                break;
            }

        })

        return flightFound;
	}

	get hasErrors(): boolean {
        return this.bookingSummaryService.getBookingValue().errors && this.bookingSummaryService.getBookingValue().errors.length > 0;
	}

	get showButtons(): boolean {
        if (this.bookingSummaryService.getBookingValue().flights == null) return false;
		
        for (let flight of (this.bookingSummaryService.getBookingValue().flights as FlightOption[])) {
			if (flight.provider == Providers.TRAVELFUSION) return false;
		}

		return !this.reservationCancelled && !this.reservationIssued;
	}

	get startDate(): string {
        if (!this.bookingSummaryService.getBookingValue().flights || this.bookingSummaryService.getBookingValue().flights.length <= 0) return '';

        if (!this.bookingSummaryService.getBookingValue().flights[0].segments || this.bookingSummaryService.getBookingValue().flights[0].segments.length <= 0) return '';

        return this.bookingSummaryService.getBookingValue().flights[0].segments[0].departureDatetime;
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
