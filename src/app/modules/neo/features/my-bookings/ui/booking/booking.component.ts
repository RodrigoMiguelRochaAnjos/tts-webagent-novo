import { Component, Input } from '@angular/core';
import { BookingSummary, BookingSummaryResponse } from '../../models/booking-summary-response.model';
import * as moment from 'moment';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

  @Input() public booking!: BookingSummary;
  
  moment = moment;
}
