import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ReservationService } from '../../data-access/reservation/reservation.service';
import { Observable } from 'rxjs';
import { FlightOption } from '../../models/flight-option.model';
import { TravellerService } from '../../data-access/traveller.service';
import { CheckoutService } from '../../data-access/checkout.service';
import { AirCheckoutDetailsResponse } from '../../features/search/models/air-checkout-details-response.model';
import { Traveller, Travellers } from '../../models/traveller/traveller.model';
import { PassengerType } from '../../features/search/utils/requests/air-search-request/passenger-type.enum';
import { SearchService } from '../../features/search/data-access/search.service';
import { AirCheckoutPriceResponse } from '../../features/search/models/air-checkout-price-response.model';
import { Providers } from '../../models/providers.enum';

@Component({
    selector: 'trip-summary',
    templateUrl: './trip-summary.component.html',
    styleUrls: ['./trip-summary.component.scss']
})
export class TripSummaryComponent {

    Providers = Providers;

    @Output() nextPressed: EventEmitter<void> = new EventEmitter<void>();

    outboundSegments: boolean = false;
    inboundSegments: boolean = false;

    selectedFlights$!: Observable<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }>;
    details$!: Observable<AirCheckoutDetailsResponse | null>;
    price$!: Observable<AirCheckoutPriceResponse | null>;

    @Input() buttonText: string = "PROCEED";
    @Input() summaryTitle: string = "Trip Summary";

    @HostBinding("class.keep-open")
    @HostBinding("class.hide-default")
    @Input() hideDefault: boolean = false;
    

    constructor(
        private reservationService: ReservationService,
        private travellerService: TravellerService,
        private checkoutService: CheckoutService,
        private searchService: SearchService
    ) {
        this.selectedFlights$ = this.reservationService.getSelectedFlights();
        this.details$ = this.checkoutService.getDetails();
        this.price$ = this.checkoutService.getPrice();

        this.price$.subscribe((price: AirCheckoutPriceResponse | null) => {
            if(price == null) return;
            // price.bookingRefs.ge
        });
    }

    public get travellers(): Travellers {
        return this.travellerService.getTravellers();
    }
    passengerDefinition(typeStr: string): string {
        const type: PassengerType = typeStr as PassengerType;
        let key = '';
        switch (type) {
            case PassengerType.Adult:
                key = 'ADULTS';
                break;
            case PassengerType.Child:
                key = 'CHILDREN';
                break;
            case PassengerType.InfantWithNoSeat:
                key = 'INFANTS_NO_SEAT';
                break;
            case PassengerType.InfantWithSeat:
                key = 'INFANTS_SEAT';
                break;
        }
        return key;
    }

    totalPassengers(typeStr: string): number {
        const type: PassengerType = typeStr as PassengerType;
        
        return this.travellerService.getTravellers().filter((traveller: Traveller) => traveller.toString() === type).length;
    }

    next() : void {
        this.nextPressed.emit();
    }
}
