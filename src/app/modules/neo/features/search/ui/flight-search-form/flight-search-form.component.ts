import { Component } from '@angular/core';
import { Journey } from 'src/app/modules/neo/models/journey/journey.model';
import { OneWay } from 'src/app/modules/neo/models/journey/types/one-way.model';
import { LocationType } from 'src/app/shared/models/location-search-response.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { SearchService } from '../../data-access/search.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { AirSearchIdResponse } from '../../utils/responses/air-search-id-response.model';
import { JourneyType } from '../../utils/journey-type.enum';
import { AirSearchRequest } from '../../utils/requests/air-search-request/air-search-request.model';
import { Mapper } from 'src/app/core/models/mapper';
import { AirSearchRequestMapper } from '../../utils/requests/air-search-request/air-search-request.mapper';
import * as moment from 'moment';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { RoundTrip } from 'src/app/modules/neo/models/journey/types/round-trip.model';
import { TravellerService } from 'src/app/modules/neo/data-access/traveller.service';

@Component({
  selector: 'flight-search-form',
  templateUrl: './flight-search-form.component.html',
  styleUrls: ['./flight-search-form.component.scss']
})
export class FlightSearchFormComponent {
    InputType = InputType;
    LocationType = LocationType;

    public journey: Journey = new RoundTrip();
    public typeSwitch: { [key: string]: boolean } = {
        'ROUNDTRIP': true,
        'ONEWAY': false
    };
    public adultTravellers: number = 0;
    public childTravellers: number = 0;

    constructor(
        private searchService: SearchService,
        private router: Router,
        private travellerService: TravellerService,
    ) {

        this.journey.origin = new SelectedLocation();
        this.journey.destination = new SelectedLocation();
    }

    search(): void {
        const mapper: AirSearchRequestMapper = new AirSearchRequestMapper();

        console.log(mapper.map(this.journey));

        // const searchId: Observable<AirSearchIdResponse> | undefined = this.searchService.getSearchId(this.airSearchRequest);

        // if (searchId == null) return;

        // searchId.subscribe({
        //     next: (response: AirSearchIdResponse) => {
        //         this.router.navigate([`neo/search/${response.id}`]);
        //     },
        // });
    }

    datesChanged(dates: DateRange): void {
        this.journey.departureDate = dates.from.format('YYYY-MM-DD');
        this.journey.returnDate = dates.to.format('YYYY-MM-DD');
    }

    typeChanged(event: { [key: string]: boolean }): void {
        let selected: string | undefined = Object.keys(event).find(key => event[key] === true);

        if(selected == null) return;

        switch(selected) {
            case JourneyType.ONE_WAY:
                this.journey = new OneWay();
                break;
            case JourneyType.ROUND_TRIP:
                this.journey = new RoundTrip();
                break;
            default:
                throw new Error("Invalid type");
        }
    }

    logTravellers(value: number) {
        console.log(value);
    }
}
