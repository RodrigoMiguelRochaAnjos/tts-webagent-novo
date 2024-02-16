import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { SearchService } from '../../data-access/search.service';
import { AirSearchRequest } from '../../utils/requests/air-search-request/air-search-request.model';
import { Observable, elementAt } from 'rxjs';
import { AirSearchResponse, AirSearchResults } from 'src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { AirSearchIdResponse } from '../../utils/responses/air-search-id-response.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { FlightOption } from 'src/app/modules/neo/models/flight-option.model';
import { trigger, transition, query, stagger, animate, style } from '@angular/animations';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {

    public results$!: Observable<AirSearchResults>;

    private id: string | null = null;

    private isObserving: boolean = false;

    reverseShowingLanguages: string[] = ['bn', 'ne', 'tr'];

    @ViewChild('infiniteScrollContainer') infiniteScrollContainer!: ElementRef<HTMLElement>;
    @ViewChild('infiniteScrollLoader') infiniteScrollLoader!: ElementRef<HTMLElement>;
    @ViewChild('results') results!: ElementRef<HTMLElement>;

    constructor(
        private searchService: SearchService,
        private router: Router,
        private route: ActivatedRoute,
        private translateService: TranslateService,
        private ngZone: NgZone
    ) {
        this.results$ = this.searchService.getResults();

        this.id = this.route.snapshot.paramMap.get("id");
    }
    
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            // Access the value of the 'id' parameter
            this.id = params.get('id');
            
            if (this.id == null) return;
            
            this.searchService.search(this.id).then((success: boolean) => {
                if (success === false && this.searchService.getResultsValue().length <= 0) {
                    this.searchService.previousSearchId = undefined;
                    this.router.navigate(['neo/search/']);
                    return;
                }

                
            });
        });
        
        
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
        if (result?.inbounds?.length > 0 && result?.inbounds?.filter((option: FlightOption) => option.show).length <= 0) return false;

        return true;
    }

    get showingResultsString() : string {

        let finalString: string = '';

        this.translateService.get('SHOWING_RESULTS').subscribe({
            next: (translation: string) => { 
                let showing: string = translation;

                const splitShowing: string[] = showing.split('[value]')

                  finalString = `${splitShowing[0]} ${this.showing} ${splitShowing[1]} ${this.max}`;

                if (this.reverseShowingLanguages.includes(this.translateService.currentLang)) finalString = `${splitShowing[0]} ${this.max} ${splitShowing[1]} ${this.showing}`;
            }
        });
        
        return finalString;

    }
    loadMore() {
        this.searchService.nextPage();
    }

    onScreen(event: {isOnScreen: boolean, element: HTMLElement}) : void {
        if (event.isOnScreen) {
            event.element.classList.toggle("on-screen");
        }
    }


    infiniteDetector(event: WheelEvent) {
        if(this.isObserving) return;

        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            this.ngZone.run(() => {
                const isIntersecting = entries[0].isIntersecting;

                if(isIntersecting) {
                    this.loadMore();
                }
                // if (isIntersecting) this.disconnectObserver();
            });
        });

        observer.observe(this.infiniteScrollContainer.nativeElement);

        this.isObserving = true;
    };

    get isLoading(): boolean {
        return this.searchService.isLoading;
    }
}
