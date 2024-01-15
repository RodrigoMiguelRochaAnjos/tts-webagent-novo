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

@Component({
  selector: 'flight-search-form',
  templateUrl: './flight-search-form.component.html',
  styleUrls: ['./flight-search-form.component.scss']
})
export class FlightSearchFormComponent {
    InputType = InputType;
    LocationType = LocationType;

    public journey: Journey = new OneWay();
    public dates!: DateRange;
    public typeSwitch: { [key: string]: boolean } = {
        'ROUND_TRIP': true,
        'ONE_WAY': false
    };

    constructor(
        private searchService: SearchService,
        private router: Router
    ) {

        this.journey.origin = new SelectedLocation();
        this.journey.destination = new SelectedLocation();
    }

    search(): void {
        console.log(this.dates);
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

    datesChanged(): void {
        this.journey.departureDate = this.dates.from.format('YYYY-MM-DD');
        this.journey.returnDate = this.dates.to.format('YYYY-MM-DD');
    }

    typeChanged(): void {

        let selected: string= '';

        for (let val of Object.keys(this.typeSwitch)) {
            if (this.typeSwitch[val]) {
                selected = val;
                break;
            }
        }

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
}
