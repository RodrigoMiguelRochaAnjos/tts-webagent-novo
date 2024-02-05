import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DayInterval } from 'src/app/modules/wallet/models/day-interval.enum';
import { AirBooking } from 'src/app/shared/models/air-booking.model';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { BookingSummaryResponse } from '../../models/booking-summary-response.model';
import { Status } from 'src/app/modules/neo/models/status.enum';
import * as moment from 'moment';
import { BookingService } from '../../../checkout/data-access/booking.service';

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

  constructor( private bookingSummaryService: BookingService){
    this.bookings$ = bookingSummaryService.getBookingSummaries();
  }

  ngOnInit() {
    this.bookings$ = this.bookingSummaryService.getBookingSummaries();

    this.bookingSummaryService.getBookingsSummary();
  }

  updateBookings(): void {
    this.bookingSummaryService.resetBookings();

    this.bookingSummaryService.getBookingsSummary(
      Object.values(Status),
      this.dateRangeCreation.dateFrom?.format("YYYY-MM-DD"),
      this.dateRangeCreation.dateTo?.format("YYYY-MM-DD"),
      this.dateRangeStart.dateFrom?.format("YYYY-MM-DD"),
      this.dateRangeStart.dateTo?.format("YYYY-MM-DD")
      );
  }
}
