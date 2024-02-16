import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AirSearchRequest } from "../utils/requests/air-search-request/air-search-request.model";
import { BehaviorSubject, Observable, Subject, Subscribable, Subscriber, TeardownLogic, takeUntil } from "rxjs";
import { AirSearchIdResponse } from "../utils/responses/air-search-id-response.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "src/app/core/authentication/auth.service";
import { AuthenticatedUser } from "src/app/core/models/user/types/authenticated-user.model";
import { AirSearchResponse, AirSearchResults } from "../../../models/responses/air-search-result/air-search-result-response.model";
import { EventSourcePolyfill, OnMessageEvent } from "ng-event-source";
import { FlightOption } from "../../../models/flight-option.model";
import { DestroyService } from "src/app/core/services/destroy.service";
import { Journey } from "../../../models/journey/journey.model";
import { AirSearchRequestMapper } from "../utils/requests/air-search-request/air-search-request.mapper";
import { RoundTrip } from "../../../models/journey/types/round-trip.model";
import { LoadingService } from "src/app/core/services/loading.service";
import { BetterFilterService, CheckboxFilterSelection, IntervalFilterSelection, IntervalType, PriceFilterSelection, SelectionType } from "./better-filter.service";
import { AirSegment } from "../../../models/air-segment.model";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private readonly VERSION: string = 'v1';
    private readonly ENDPOINT: string = environment.endpoints.NEO;

    previousSearchId?: string;
    public isLoading: boolean = false;
    
    public itemsPerPage: number = 30;
    public page: number = 1;
    private filteredResults: number = 0;
    
    private results$: BehaviorSubject<AirSearchResults> = new BehaviorSubject<AirSearchResults>([]);
    private searchResume$: BehaviorSubject<Journey> = new BehaviorSubject<Journey>(new RoundTrip());
    private isFiltering$: Promise<boolean>;

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
        private destroyService: DestroyService,
        private loadingService: LoadingService,
        private betterFilterService: BetterFilterService
    ) {
        this.isFiltering$ = Promise.resolve(false);
    }

    public getResults() : Observable<AirSearchResults> {
        return this.results$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public get isFiltering(): Promise<boolean> {
        return this.isFiltering$;
    }

    public getSearchResume(): Observable<Journey> {
        return this.searchResume$;
    }

    public getSearchResumeValue(): Journey {
        return this.searchResume$.value;
    }

    public getResultsValue(): AirSearchResults {
        return this.results$.value;
    }

    public getSearchId(airSearch: Journey): Observable<AirSearchIdResponse> | undefined {
        const user = this.authService.getUserValue();

        if (!(user instanceof AuthenticatedUser)) return undefined;

        const http: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`
        });

        const mapper: AirSearchRequestMapper = new AirSearchRequestMapper();

        return this.httpClient.post<AirSearchIdResponse>(`${this.ENDPOINT}/${this.VERSION}/search`, mapper.map(airSearch), { headers: http }).pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public updateSearchResume(searchResume: Journey) {
        this.searchResume$.next(searchResume);
    }

    public search(searchId: string) : Promise<boolean> {


        return new Promise((resolve) => {

            const user = this.authService.getUserValue();
    
            if (!(user instanceof AuthenticatedUser)) return;
    
            this.previousSearchId = searchId;
    
            this.results$.next([]);

            this.isLoading = true;

            this.loadingService.load();
            new Observable<AirSearchResponse>((observer: Subscriber<AirSearchResponse>) => {
                const eventSource: EventSourcePolyfill = new EventSourcePolyfill(
                    `${this.ENDPOINT}/${this.VERSION}/search/${searchId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                `Bearer ${user.token}`
                        },
                    }
                );
                let index = 0;
                eventSource.onmessage = (message: OnMessageEvent) => {
                    this.loadingService.dismiss();

                    const result: AirSearchResponse = Object.assign<AirSearchResponse, any>(new AirSearchResponse(), JSON.parse(message.data));
                    result.show = false;
                    if (index < (this.page * this.itemsPerPage)) result.show = true;

                    if (result.inbounds) result.inbounds = result.inbounds.map((option: FlightOption) => {
                        option.show = true;
                        return option;
                    }).sort((a: FlightOption, b: FlightOption) => new Date(a.segments[0].departureDatetime).getTime() - new Date(b.segments[0].departureDatetime).getTime());

                    result.outbounds = result.outbounds.map((option: FlightOption) => {
                        option.show = true;
                        return option;
                    }).sort((a: FlightOption, b: FlightOption) => new Date(a.segments[0].departureDatetime).getTime() - new Date(b.segments[0].departureDatetime).getTime());

                    index++;

                    observer.next(result);

                    resolve(true);
                }
    
                eventSource.onerror = () => {
                    this.loadingService.dismiss();
                    this.isLoading = false;
    
                    eventSource.close();

                    observer.complete();

                    resolve(false);
                }
    
                return () => {
                    this.loadingService.dismiss();
                    eventSource.close();
                }
            }).subscribe({
                next: (result: AirSearchResponse) => {
                    const results: AirSearchResults = this.results$.value


                    results.push(result);

                    this.results$.next(results);
                },
                complete: () => {
                    this.setDefaultValues();
                }

            })
            
            // .subscribe({
            //     next: (result: AirSearchResponse) => {
            //         this.results$.next(this.results$.value.concat(result));
            //     }
            // })
        });
    }

    public nextPage(): void {
        this.page++;

        // if (this.betterFilterService.areOriginalFilters) {
        //     this.applyDefaultFilters();

        //     return;
        // }

        this.applyFilters();
    }

    private applyDefaultFilters(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.results$.next(
                this.results$.getValue()
                    .map((result: AirSearchResponse, index: number) => {
                        if (index < (this.page * this.itemsPerPage)) result.show = true;
                        
                        return result;
                    })
            );

            resolve();
        })
    }

    public reset(): void {
        this.page = 1;

        this.setDefaultValues();
        this.applyDefaultFilters();
    }
    
    private setDefaultValues(): void {

        const sortedPrices = this.results$.getValue().sort((a, b) => {
            const p1 = a.price.totalAmount;
            const p2 = b.price.totalAmount;

            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
            return 0;
        });

        if (sortedPrices.length > 0) {
            this.betterFilterService.updatePriceFilter({
                max: sortedPrices[sortedPrices.length - 1].price.totalAmount,
                min: 0,
                selected: {
                    max: sortedPrices[sortedPrices.length - 1].price.totalAmount,
                    min: 0
                },
                currency: this.authService.getUserValue().settings.currency
            });
            console.log({
                max: sortedPrices[sortedPrices.length - 1].price.totalAmount,
                min: 0,
                selected: {
                    max: sortedPrices[sortedPrices.length - 1].price.totalAmount,
                    min: 0
                },
                currency: this.authService.getUserValue().settings.currency
            });
        }


        const carriers: Set<string> = new Set<string>();
        const classes: Set<string> = new Set<string>();
        let maxStops: number = 0;


        this.results$.value.forEach((result: AirSearchResponse) => {
            let inbounds: FlightOption[] = result.inbounds ? result.inbounds : [];
            let outbounds: FlightOption[] = result.outbounds;

            inbounds.concat(outbounds).forEach((option: FlightOption) => {
                option.segments.map((segment: AirSegment) => segment.marketingCarrier.name == "" ? segment.marketingCarrier.code : segment.marketingCarrier.name)
                    .forEach((value: string) => {
                        carriers.add(value);
                    });
            });

            inbounds.concat(outbounds).forEach((option: FlightOption) => {
                option.segments
                    .filter((segment: AirSegment) => segment.fareDetailsList && segment.fareDetailsList.length > 0)
                    .map((segment: AirSegment) => segment.fareDetailsList[0].bookingClass)
                    .forEach((value: string) => {
                        classes.add(value);
                    });
            })

            inbounds.concat(outbounds).forEach((option: FlightOption) => {
                if (option.segments.length - 1 > maxStops) maxStops = option.segments.length - 1;
            });
        });
        console.log(Array.from(carriers));
        this.betterFilterService.updateCheckboxFilter(SelectionType.CARRIERS, Array.from(carriers).map((value: string) => {
            return { value: value, label: value, selected: true };
        }));

        this.betterFilterService.updateCheckboxFilter(SelectionType.CLASSES, Array.from(classes).map((value: string) => {
            return { value: value, label: value, selected: true };
        }));

        this.betterFilterService.updateIntervalFilter(IntervalType.DEPARTURE,
            {
                min: 0,
                max: 1440,
                selected: {
                    min: 0,
                    max: 1440,
                }
            }
        )

        this.betterFilterService.updateIntervalFilter(IntervalType.RETURN,
            {
                min: 0,
                max: 1440,
                selected: {
                    min: 0,
                    max: 1440,
                }
            }
        )

        this.betterFilterService.updateIntervalFilter(IntervalType.STOPS,
            {
                min: 0,
                max: maxStops,
                selected: {
                    min: 0,
                    max: maxStops,
                }
            }
        )

    }

    public applyFilters(): void {
        this.isFiltering$ = Promise.resolve(true);


        this.isFiltering$ = new Promise<boolean>((resolve) => {
            this.applyDefaultFilters()
                .then(() => this.filterPrice())
                .then(() => this.filterCarriers())
                .then(() => this.filterClasses())
                .then(() => this.filterStops())
                .then(() => this.filterDepartureTime())
                .then(() => this.filterReturnTime())
                .then(() => this.finishFiltering())
                .finally(() => {
                    resolve(false);
                })

        });

    }

    private finishFiltering(): Promise<void> {
        console.log("finishFiltering");
        return new Promise<void>((resolve) => {
            this.results$.next(
                this.results$.getValue()
                    .sort((a: AirSearchResponse, b: AirSearchResponse) => {
                        if (a.show && !b.show) return -1;
                        if (!a.show && b.show) return 1;

                        return 0;

                    })
                    .map((result: AirSearchResponse, index: number) => {
                        if (index < (this.page * this.itemsPerPage) && result.show) result.show = true;
                        else {
                            result.show = false;
                            return result;
                        }

                        if (result.inbounds) {
                            result.inbounds = result.inbounds.sort((a: FlightOption, b: FlightOption) => new Date(a.segments[0].departureDatetime).getTime() - new Date(b.segments[0].departureDatetime).getTime());
                        }

                        result.outbounds = result.outbounds.sort((a: FlightOption, b: FlightOption) => new Date(a.segments[0].departureDatetime).getTime() - new Date(b.segments[0].departureDatetime).getTime());

                        return result;
                    }).sort((a: AirSearchResponse, b: AirSearchResponse) => {
                        return a.price.totalAmount - b.price.totalAmount
                    })
            );

            console.log(this.results$.getValue().filter((result) => result.show).length);
            resolve();

            this.filteredResults = this.results$.getValue().filter((result) => result.show).length;
        });
    }

    private async filterPrice(): Promise<void> {
        console.log("filterPrice");

        return new Promise<void>((resolve) => {
            const selection: PriceFilterSelection = this.betterFilterService.priceFilterSelection;
            this.results$.next(
                this.results$.value.map((result: AirSearchResponse) => {
                    result.show = !(result.price.totalAmount < selection.selected.min || result.price.totalAmount > selection.selected.max);

                    return result;
                })
            )
            console.log(this.results$.getValue().filter((result) => result.show).length);
            resolve()
        })
    }

    private async filterStops(): Promise<void> {
        console.log("filterStops");

        return new Promise<void>((resolve) => {
            const selection: IntervalFilterSelection | undefined = this.betterFilterService.intervalFilterSelection.get(IntervalType.STOPS);
            
            if (!selection) {
                resolve();
                return;
            }

            this.results$.next(
                this.results$.value.map((result: AirSearchResponse) => {
                    const inbounds: FlightOption[] = result.inbounds ? result.inbounds : [];
                    const outbounds: FlightOption[] = result.outbounds

                    outbounds.concat(inbounds).forEach((option: FlightOption) => {
                        if ((option.segments.length - 1) < selection.selected.min || (option.segments.length - 1) > selection.selected.max) {
                            result.show = false;
                        }
                    })

                    return result;
                })
            )
            console.log(this.results$.getValue().filter((result) => result.show).length);

            resolve();
        });
    }

    private async filterCarriers(): Promise<void> {
        console.log("filterCarriers");

        return new Promise<void>((resolve) => {
            const chosenFilters: string[] = this.betterFilterService.checkboxFilterSelection.get(SelectionType.CARRIERS)!.filter((checkbox: CheckboxFilterSelection) => checkbox.selected)
                .map((selection: CheckboxFilterSelection) => selection.value);



            this.results$.next(
                this.results$.value.map((result: AirSearchResponse) => {
                    const inbounds: FlightOption[] = result.inbounds ? result.inbounds : [];
                    const outbounds: FlightOption[] = result.outbounds

                    inbounds.concat(outbounds).forEach((option: FlightOption) => {
                        option.segments.forEach((segment: AirSegment) => {
                            if (!chosenFilters.includes(segment.marketingCarrier.name == "" ? segment.marketingCarrier.code : segment.marketingCarrier.name)) {
                                result.show = false;
                            }

                        })
                    })

                    return result;
                })
            )
            console.log(this.results$.getValue().filter((result) => result.show).length);

            resolve();
        });
    }

    private async filterClasses(): Promise<void> {
        console.log("filterClasses");

        return new Promise<void>((resolve) => {
            const chosenFilters: string[] = this.betterFilterService.checkboxFilterSelection.get(SelectionType.CLASSES)!
                .filter((checkbox: CheckboxFilterSelection) => checkbox.selected)
                .map((selection: CheckboxFilterSelection) => selection.value);


            this.results$.next(
                this.results$.value.map((result: AirSearchResponse) => {
                    const inbounds: FlightOption[] = result.inbounds ? result.inbounds : [];
                    const outbounds: FlightOption[] = result.outbounds

                    inbounds.concat(outbounds).forEach((option: FlightOption) => {
                        option.segments
                            .filter((segment: AirSegment) => segment.fareDetailsList && segment.fareDetailsList.length > 0)
                            .forEach((segment: AirSegment) => {
                                if (!chosenFilters.includes(segment.fareDetailsList[0].bookingClass)) {
                                    result.show = false;
                                }

                            })
                    })

                    return result;
                })
            )
            console.log(this.results$.getValue().filter((result) => result.show).length);

            resolve();
        });
    }

    private async filterDepartureTime(): Promise<void> {
        console.log("filterDepartureTime");

        return new Promise<void>((resolve) => {
            const selection: IntervalFilterSelection | undefined = this.betterFilterService.intervalFilterSelection.get(IntervalType.DEPARTURE);

            if (!selection) {
                resolve();
                return;
            }

            this.results$.next(
                this.results$.value.map((result: AirSearchResponse) => {
                    result.outbounds.forEach((option: FlightOption) => {
                        option.segments.forEach((segment: AirSegment) => {
                            const departure: Date = new Date(segment.departureDatetime);

                            option.show = !(
                                (departure.getHours() * 60 + departure.getMinutes()) < selection.selected.min ||
                                (departure.getHours() * 60 + departure.getMinutes()) > selection.selected.max
                            );
                        })
                    })

                    return result;
                })
            )
            console.log(this.results$.getValue().filter((result) => result.show).length);

            resolve()
        });

    }

    private async filterReturnTime(): Promise<void> {
        console.log("filterReturnTime");

        return new Promise<void>((resolve) => {
            const selection: IntervalFilterSelection | undefined = this.betterFilterService.intervalFilterSelection.get(IntervalType.RETURN);

            if(!selection) {
                resolve();
                return;
            }

            this.results$.next(
                this.results$.value.map((result: AirSearchResponse) => {
                    if (!result.inbounds) return result;

                    result.inbounds.forEach((option: FlightOption) => {
                        option.segments.forEach((segment: AirSegment) => {
                            const departure: Date = new Date(segment.departureDatetime);

                            option.show = !(
                                (departure.getHours() * 60 + departure.getMinutes()) < selection.selected.min ||
                                (departure.getHours() * 60 + departure.getMinutes()) > selection.selected.max
                            );



                        })
                    })

                    return result;
                })
            )

            console.log(this.results$.getValue().filter((result) => result.show).length);

            resolve();
        });


    }
}