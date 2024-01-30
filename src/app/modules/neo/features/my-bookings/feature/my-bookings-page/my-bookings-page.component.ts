import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DayInterval } from 'src/app/modules/wallet/models/day-interval.enum';
import { AirBooking } from 'src/app/shared/models/air-booking.model';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { BookingService } from 'src/app/shared/services/booking.service';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { BookingSummaryService } from '../../data-access/booking-summary.service';
import { BookingSummaryResponse } from '../../models/booking-summary-response.model';
import { Status } from 'src/app/modules/neo/models/status.enum';
import * as moment from 'moment';

@Component({
  selector: 'app-my-bookings-page',
  templateUrl: './my-bookings-page.component.html',
  styleUrls: ['./my-bookings-page.component.scss']
})
export class MyBookingsPageComponent implements OnInit {
  InputType = InputType;
  DayInterval = DayInterval;

  bookings$!: Observable<BookingSummaryResponse>;

  dateRangeCreation: DateRange = new DateRange();
  dateRangeStart: DateRange = new DateRange();

  constructor( private bookingSummaryService: BookingSummaryService){
    this.bookings$ = bookingSummaryService.getBookings();
  }

  ngOnInit() {
    this.bookings$ = this.bookingSummaryService.getBookings();

    this.bookingSummaryService.getBookingsSummary();
  }

  updateBookings(): void {
    this.bookingSummaryService.resetBookings();

    this.bookingSummaryService.getBookingsSummary(
      Object.values(Status),
      this.dateRangeCreation.from?.format("YYYY-MM-DD"),
      this.dateRangeCreation.to?.format("YYYY-MM-DD"),
      this.dateRangeStart.from?.format("YYYY-MM-DD"),
      this.dateRangeStart.to?.format("YYYY-MM-DD")
      );
  }
}
