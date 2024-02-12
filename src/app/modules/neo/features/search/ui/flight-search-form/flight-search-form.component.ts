import { Component, OnInit } from '@angular/core';
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
import { TravellerTypes } from 'src/app/modules/neo/models/traveller/traveller-types.enum';
import { AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'flight-search-form',
  templateUrl: './flight-search-form.component.html',
  styleUrls: ['./flight-search-form.component.scss']
})
export class FlightSearchFormComponent implements OnInit{
    InputType = InputType;
    LocationType = LocationType;
    TravellerTypes = TravellerTypes;

    public journey: Journey = new RoundTrip();
    public typeSwitch: { [key: string]: boolean } = {
        'ROUND_TRIP': true,
        'ONE_WAY': false
    };

    oneWayDate?: moment.Moment;
    roudTripDate: DateRange = new DateRange();

    searchResume$!: Observable<Journey>;

    constructor(
        private searchService: SearchService,
        private router: Router,
        private travellerService: TravellerService,
        private alertService: AlertService
        private loadingService: LoadingService
    ) {
        this.searchResume$ = this.searchService.getSearchResume();

        this.journey.origin = new SelectedLocation();
        this.journey.destination = new SelectedLocation();

        if (this.travellerService.getTravellers().length === 0) this.travellerService.addTraveller(TravellerTypes.ADULTS);
    }
    ngOnInit(): void {
        this.journey = this.searchService.getSearchResumeValue();

        this.roudTripDate = new DateRange();
        this.roudTripDate.dateFrom = this.getMomentDate(this.journey.departureDate)
        this.roudTripDate.dateTo = this.getMomentDate(this.journey.returnDate)

        this.searchResume$.subscribe((searchResume: Journey) => {
            this.journey = searchResume;
        })
    }

    get isRoundTrip(): boolean {
        return this.journey instanceof RoundTrip;
    }

    private saveTravellers(): void {
        this.journey.travellers = this.travellerService.getTravellers();
    }

    search(): void {
        this.saveTravellers();

        if (this.oneWayDate != null) this.journey.departureDate = this.oneWayDate.format('YYYY-MM-DD')

        if(!this.journey.origin || !this.journey.destination || !this.journey.departureDate || (!this.journey.returnDate && this.journey instanceof RoundTrip)) {
            this.alertService.show(AlertType.ERROR, "Please fill in all the fields before proceeding");
            return;
        }

        if(this.journey.origin.code === this.journey.destination.code) {
            this.alertService.show(AlertType.ERROR, "The flight origin and destination cannot be the same!");
            return;
        }

        if(!this.journey.origin || !this.journey.destination || !this.journey.departureDate || (!this.journey.returnDate && this.journey instanceof RoundTrip)) {
            this.alertService.show(AlertType.ERROR, "Please fill in all the fields before proceeding");
            return;
        }

        if(this.journey.origin.code === this.journey.destination.code) {
            this.alertService.show(AlertType.ERROR, "The flight origin and destination cannot be the same!");
            return;
        }

        const searchId: Observable<AirSearchIdResponse> | undefined = this.searchService.getSearchId(this.journey);

        if (searchId == null) return;

        searchId.subscribe({
            next: (response: AirSearchIdResponse) => {
                this.searchService.reset();

                this.router.navigate([`neo/search/${response.id}`]);
            },
        });
    }

    datesChanged(dates: DateRange): void {
        this.journey.departureDate = dates.dateFrom?.format('YYYY-MM-DD');
        this.journey.returnDate = dates.dateTo?.format('YYYY-MM-DD');
    }

    typeChanged(event: { [key: string]: boolean }): void {
        let selected: string | undefined = Object.keys(event).find(key => event[key] === true);

        if(selected == null) return;

        switch(selected) {
            case 'ONE_WAY':
                this.journey = new OneWay();
                break;
            case 'ROUND_TRIP':
                this.journey = new RoundTrip();
                break;
            default:
                throw new Error("Invalid type");
        }
    }

    decrease(field: TravellerTypes): void {
        if (this.travellerService.numTravellers() <= 1) return;
        if (this.counterNumber(field) <= 0) return;

        this.travellerService.removeTraveller(field);
    }

    increase(field: TravellerTypes): void {
        if (this.travellerService.numTravellers() >= 9) return;

        this.travellerService.addTraveller(field);
    }

    counterNumber(field: TravellerTypes): number {
        return this.travellerService.numTravellers(field)
    }

    get minDate(): string {
        const dateMin = moment().subtract(1, 'day').format('DD/MM/YYYY');

        return dateMin;
    }

    get maxDate(): string {
        const dateMax = moment().add(1, 'year').format('DD/MM/YYYY');

        return dateMax;
    }

    getMomentDate(date: string): moment.Moment {
        return moment(date, 'YYYY-MM-DD')
    }

    switchDestinations(): void {
        const tmpDeparture = this.journey.origin;
        this.journey.origin = this.journey.destination;
        this.journey.destination = tmpDeparture;
    }
}
