import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AirSearchIdResponse } from '../../models/responses/air-search-id-response.model';
import { SearchService } from '../../features/search/data-access/search.service';
import { Router } from '@angular/router';
import { AirSearchRequest } from '../../features/search/utils/requests/air-search-request/air-search-request.model';
import { Journey } from '../../models/journey/journey.model';
import { OneWay } from '../../models/journey/types/one-way.model';
import { SelectedLocation } from '../../models/selected-location.model';
import { LocationType } from '../../models/responses/location-search-response.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';

@Component({
  selector: 'flight-search-form',
  templateUrl: './flight-search-form.component.html',
  styleUrls: ['./flight-search-form.component.scss']
})
export class FlightSearchFormComponent {
    InputType = InputType;
    LocationType = LocationType;

    public journey: Journey = new OneWay();

    private airSearchRequest!: AirSearchRequest;

    constructor(
        private searchService: SearchService,
        private router: Router
    ) {

        this.journey.origin = new SelectedLocation();
        this.journey.destination = new SelectedLocation();
        this.airSearchRequest = JSON.parse(`{"authentication":{"travelFusionUser":"","travelFusionPassword":""},"routeType":"ROUNDTRIP","routes":[{"origin":{"code":"PDL","type":"CITY"},"destination":{"code":"LIS","type":"CITY"},"departureDate":"2024-02-08"},{"origin":{"code":"LIS","type":"CITY"},"destination":{"code":"PDL","type":"CITY"},"departureDate":"2024-02-15"}],"passengers":[{"type":"ADULT"}],"currency":"EUR"}`);
    }

    search(): void {
        console.log("yo wassup")
        const searchId: Observable<AirSearchIdResponse> | undefined = this.searchService.getSearchId(this.airSearchRequest);

        if (searchId == null) return;

        searchId.subscribe({
            next: (response: AirSearchIdResponse) => {
                this.router.navigate([`neo/search/${response.id}`]);
            },
        });
    }

    logSelectedLocation(selectedLocation: {type: LocationType, location: SelectedLocation}) : void {

        switch(selectedLocation.type){
            case LocationType.ORIGIN:
                this.journey.origin = selectedLocation.location;
                break;
            case LocationType.DESTINATION:
                this.journey.destination = selectedLocation.location;
                break;
        }

        console.log(this.journey);
    }

}
