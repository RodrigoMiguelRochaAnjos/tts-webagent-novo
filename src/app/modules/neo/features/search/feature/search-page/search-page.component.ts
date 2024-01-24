import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { SearchService } from '../../data-access/search.service';
import { AirSearchRequest } from '../../utils/requests/air-search-request/air-search-request.model';
import { Observable, elementAt } from 'rxjs';
import { AirSearchResponse, AirSearchResults } from 'src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AirSearchIdResponse } from '../../utils/responses/air-search-id-response.model';
import { LoadingService } from 'src/app/core/interceptors/loading.service';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { FlightOption } from 'src/app/modules/neo/models/flight-option.model';
import { trigger, transition, query, stagger, animate, style } from '@angular/animations';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {

    public results$!: Observable<AirSearchResults>;

    private id: string | null = null;

    constructor(
        private searchService: SearchService,
        private router: Router,
        private route: ActivatedRoute,

    ) {
        this.results$ = this.searchService.getResults();

        this.id = this.route.snapshot.paramMap.get("id");

        if (this.id == null) return;

        this.searchService.search(this.id).then((success: boolean) => {
            if (success === false && this.searchService.getResultsValue().length <= 0) {
                this.searchService.previousSearchId = undefined;
                this.router.navigate(['neo/search/']);
            }
        });

    }

    ngOnInit(): void {
        if (this.searchService.previousSearchId != null) this.router.navigate([`neo/search/${this.searchService.previousSearchId}`]);
    }

    get hasResults(): boolean {
        return this.searchService.getResultsValue().length > 0
    }

    get showing(): number {
        if ((this.searchService.itemsPerPage * this.searchService.page) >= this.max) return this.max;

        return (this.searchService.itemsPerPage * this.searchService.page);
    }

    get max(): number {
        return this.searchService.getResultsValue().length;
    }

    hasOptions(result: AirSearchResponse): boolean {
        if (result.outbounds.filter((option: FlightOption) => option.show).length <= 0) return false;
        if (result.inbounds.length > 0 && result.inbounds.filter((option: FlightOption) => option.show).length <= 0) return false;

        return true;
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event: any) {
        if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 100
        ) {
            this.searchService.nextPage();
        }
    }

    onScreen(event: {isOnScreen: boolean, element: HTMLElement}) : void {
        if (event.isOnScreen) {
            event.element.classList.toggle("on-screen");
        }
    }
}
