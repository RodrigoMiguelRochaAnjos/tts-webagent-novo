import { Component } from '@angular/core';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import { MarketingCarrierObj } from './marketing-carrier-obj';
import { FlightOption } from '../../../models/flight-option.model';
import { ReservationService } from '../../../data-access/reservation.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-traveller-details-page',
  templateUrl: './traveller-details-page.component.html',
  styleUrls: ['./traveller-details-page.component.scss']
})
export class TravellerDetailsPageComponent {
  InputType = InputType;
  patterns = patterns;
  marketingCarrier!: MarketingCarrierObj;

  public date: moment.Moment = moment();
  
  option!: Observable< { [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }>;
  

  logo_url = "https://carrierlogos.s3.us-east-2.amazonaws.com/U2.png"

  constructor
  (
    reservationService: ReservationService
  ){
    this.marketingCarrier = {
      code: 'U2',
      logoUrl: 'https://carrierlogos.s3.us-east-2.amazonaws.com/U2.png',
      carrierName: 'Easy Jet'
    };
    
    this.option = reservationService.getSelectedFlights();
    console.log("reservationService.getSelectedFlightsValue():", this.option);

  }

  formatDateTime(date: string) {
    const formattedDate: string = moment(date, "YYYY-MM-DDTHH:mm:ss").format('HH:mm');

    return formattedDate;
  }

  formatDate(date: string) {
    const formattedDate: string = moment(date, "YYYY-MM-DDTHH:mm:ss").format('DD-L');

  }
}
