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


  minPrice: number = 0;
  maxPrice: number = 999999;
  minSelectedDate!: string;
  maxSelectedDate!: string;
  minStartSelectedDate!: string;
  maxStartSelectedDate!: string;
  statusValues!: string[];

  constructor( private bookingSummaryService: BookingSummaryService){
    this.bookings$ = bookingSummaryService.getBookings();
    console.log(this.bookings$);
  }

  ngOnInit() {
    this.bookings$ = this.bookingSummaryService.getBookings();

    if(this.minSelectedDate == null) {
      this.minSelectedDate =  moment().subtract(2, 'years').format('YYYY-MM-DD');
      this.maxSelectedDate = moment().add(2, 'years').format('YYYY-MM-DD');
    }

    if(this.minStartSelectedDate == null) {
      this.minStartSelectedDate = moment().subtract(2, 'years').format('YYYY-MM-DD');
      this.maxStartSelectedDate = moment().format('YYYY-MM-DD');
    }

    if(this.statusValues == null) this.statusValues = ["CONFIRMED", "UNCONFIRMED", "FAILED", "PARTIALLY_CONFIRMED", "CANCELLED"];

    this.bookingSummaryService.getBookingsSummary(
        this.statusValues, 
        this.minSelectedDate,
        this.maxSelectedDate,
        this.minStartSelectedDate,
        this.maxStartSelectedDate
    );
  }

  updateBookings(): void {
    this.bookingSummaryService.resetBookings();


    if((this.dateRangeCreation.from && this.dateRangeCreation.to) &&
     (this.dateRangeStart.from && this.dateRangeStart.to) != null) this.bookingSummaryService.getBookingsSummary( [Status.CANCELLED, Status.CONFIRMED,Status.FAILED, Status.PARTIALLY_CONFIRMED, Status.UNCONFIRMED], this.dateRangeCreation.from?.format("YYYY-MM-DD"), this.dateRangeCreation.to?.format("YYYY-MM-DD"),this.dateRangeStart.from?.format("YYYY-MM-DD"), this.dateRangeStart.to?.format("YYYY-MM-DD"));

  }
  
  // onDateFilterChanged(eventData: any) {
  //   this.minSelectedDate = eventData.minSelectedDate;
  //   this.maxSelectedDate = eventData.maxSelectedDate;
  //   this.minStartSelectedDate = eventData.minStartSelectedDate;
  //   this.maxStartSelectedDate = eventData.maxStartSelectedDate;
  // }

}
