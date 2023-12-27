import { AfterViewInit, Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
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
export class WebagentLocationSearchComponent extends WebagentBaseComponent {
    results$!: Observable<LocationSearchResponse>;
    focused: boolean = false;

    constructor(
        private locationSearchService: LocationSearchService,
        private el: ElementRef
    ) {
        super();

        this.results$ = this.locationSearchService.getResults();
    }

    searchLocation(event: Event): void {
        this.focused = true;
        if ((event.target as HTMLInputElement).value.length > 2) this.locationSearchService.search((event.target as HTMLInputElement).value)
    }

    locationSelected(event: Event, location: LocationSearch, airport?: Airport): void {
        event.stopPropagation();

        this.resetSearchField();

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
        setTimeout(() => this.focused = false, 100);
    }

}
