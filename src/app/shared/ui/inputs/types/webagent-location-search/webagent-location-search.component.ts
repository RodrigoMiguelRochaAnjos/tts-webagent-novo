import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { WebagentBaseComponent } from '../webagent-base/webagent-base.component';
import { Observable } from 'rxjs';
import { Airport, LocationSearch, LocationSearchResponse } from 'src/app/shared/models/location-search-response.model';
import { LocationSearchService } from 'src/app/shared/services/location-search/location-search.service';
import { SelectedLocation } from 'src/app/shared/models/selected-location.model';
import { LocationMapper } from 'src/app/shared/services/location-search/location.mapper';

@Component({
  selector: 'app-webagent-location-search',
  templateUrl: './webagent-location-search.component.html',
  styleUrls: ['./webagent-location-search.component.scss']
})
export class WebagentLocationSearchComponent extends WebagentBaseComponent implements OnInit {
    results$!: Observable<LocationSearchResponse>;
    focused: boolean = false;

    private selectedLocationSearch: LocationSearch | undefined;

    cityIndex: number = -1;
    airportIndex: number = -1;

    constructor(
        private locationSearchService: LocationSearchService,
        private el: ElementRef
    ) {
        super();

        this.results$ = this.locationSearchService.getResults();
    }

    ngOnInit(): void {
        if(this.value == '' || this.value == null) this.value = new SelectedLocation();
        if (!(this.value instanceof SelectedLocation)) throw new Error("Invalid value expected type of SelectedLocation");
    }

    searchLocation(event: Event): void {
        this.focused = true;
        if ((event.target as HTMLInputElement).value.length > 2) this.locationSearchService.search((event.target as HTMLInputElement).value);

        this.airportIndex = -1;
        this.cityIndex = 0;
    }

    locationSelected(event: Event, location: LocationSearch, airport?: Airport): void {
        event.stopPropagation();

        const selected: SelectedLocation = LocationMapper.locationSearchToSelectedLocation(location, airport);

        this.value = selected;
        this.update();
    }

    resetSearchField(): void {
        this.focused = false;
        this.locationSearchService.reset();
    }

    @HostListener('focusin', ['$event'])
    focusIn(event: FocusEvent): void {
        this.value.text = '';
        this.focused = true;
    }

    @HostListener('focusout', ['$event'])
    onBlur(event: FocusEvent): void {
        setTimeout(() => {
            this.focused = false;

            if (this.locationSearchService.getResultsValue().length <= 0) return;

            const first: LocationSearch | undefined = this.locationSearchService.getResultsValue()[0];

            if (!first) return;

            this.locationSelected(event, first);
        }, 100);
    }

    handleNavigation(event: KeyboardEvent): void {
        switch(event.key){
            case "Enter":
                this.handleEnter(event);
                break;
            case "ArrowUp":
                this.handleKeyUp();
                break;
            case "ArrowDown":
                this.handleKeyDown();
                break;
        }
    }


    private handleEnter(event: KeyboardEvent): void {
        if (this.locationSearchService.getResultsValue().length <= 0) return;

        let selectedCity: LocationSearch | undefined = this.locationSearchService.getResultsValue()[0];;

        if (this.cityIndex !== -1) selectedCity = this.locationSearchService.getResultsValue()[this.cityIndex];

        let selectedAirport: Airport = selectedCity?.airports[this.airportIndex];

        if (!selectedCity) return;

        this.locationSelected(event, selectedCity, selectedAirport);
        this.focused = false;
    }

    private handleKeyUp(): void {

        if(this.selectedLocationSearch == null){
            this.cityIndex = 0;
            this.selectedLocationSearch = this.locationSearchService.getResultsValue()[this.cityIndex];
        }
        
        if (this.airportIndex >= 0) {
            this.airportIndex--;
        }else if(this.cityIndex > 0) {
            this.cityIndex--;
        }
    }

    private handleKeyDown(): void {
        if (this.selectedLocationSearch == null) {
            this.cityIndex = 0;
            this.selectedLocationSearch = this.locationSearchService.getResultsValue()[this.cityIndex];
            return;
        }


        if (this.airportIndex < this.selectedLocationSearch.airports.length - 1) {
            this.airportIndex++;
            return;
        }else if (this.cityIndex < this.locationSearchService.getResultsValue().length - 1 && this.selectedLocationSearch.airports.length - 1 === this.airportIndex) {
            this.cityIndex++;
            this.selectedLocationSearch = this.locationSearchService.getResultsValue()[this.cityIndex];
            return;
        }

        
    }

}
