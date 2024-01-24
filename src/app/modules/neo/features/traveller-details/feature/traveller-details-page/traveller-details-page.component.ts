import { Component } from '@angular/core';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import { FlightOption } from '../../../../models/flight-option.model';
import { ReservationService } from '../../../../data-access/reservation.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { TravellerService } from 'src/app/modules/neo/data-access/traveller.service';
import { Traveller, Travellers } from 'src/app/modules/neo/models/traveller/traveller.model';
import { Contact } from 'src/app/core/models/user/contact/contact.model';
import { Address } from 'src/app/core/models/user/contact/segments/address.model';
import { Phone } from 'src/app/core/models/user/contact/segments/phone.model';

@Component({
    selector: 'app-traveller-details-page',
    templateUrl: './traveller-details-page.component.html',
    styleUrls: ['./traveller-details-page.component.scss']
})
export class TravellerDetailsPageComponent {
    InputType = InputType;
    patterns = patterns;

    public date: moment.Moment = moment();

    option!: Observable<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }>;

    constructor(
        private reservationService: ReservationService,
        private travellerService: TravellerService
    ) {
        this.option = this.reservationService.getSelectedFlights();

        this.travellerService.setTraveller(
            this.travellerService.getTravellers().map((traveller: Traveller) => {
                traveller.contact = new Contact();
                traveller.contact.phone = new Phone();
                traveller.contact.address = new Address();

                return traveller;
            })
        ) 

    }

    get travellers(): Travellers {
        return this.travellerService.getTravellers();
    }

    formatDateTime(date: string): string {
        return moment(date, "YYYY-MM-DDTHH:mm:ss").format('HH:mm');
    }

    formatDate(date: string) {
        const formattedDate: string = moment(date, "YYYY-MM-DDTHH:mm:ss").format('DD-L');

    }
}
