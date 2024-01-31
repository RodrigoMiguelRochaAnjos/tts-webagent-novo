import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AirSearchRequest } from "../utils/requests/air-search-request/air-search-request.model";
import { BehaviorSubject, Observable, Subscribable, Subscriber, TeardownLogic, takeUntil } from "rxjs";
import { AirSearchIdResponse } from "../utils/responses/air-search-id-response.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "src/app/core/authentication/auth.service";
import { AuthenticatedUser } from "src/app/core/models/user/types/authenticated-user.model";
import { AirSearchResponse, AirSearchResults } from "../../../models/responses/air-search-result/air-search-result-response.model";
import { EventSourcePolyfill, OnMessageEvent } from "ng-event-source";
import { FlightOption } from "../../../models/flight-option.model";
import { DestroyService } from "src/app/core/services/destroy.service";

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

    private results$: BehaviorSubject<AirSearchResults> = new BehaviorSubject<AirSearchResults>([]);

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
        private destroyService: DestroyService
    ) {
        
    }

    public getResults() : Observable<AirSearchResults> {
        return this.results$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getResultsValue(): AirSearchResults {
        return this.results$.value;
    }

    public getSearchId(airSearch: AirSearchRequest): Observable<AirSearchIdResponse> | undefined {
        const user = this.authService.getUserValue();

        if (!(user instanceof AuthenticatedUser)) return undefined;

        const http: HttpHeaders = new HttpHeaders({
            'skip': "true",
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user.token}`
        });

        return this.httpClient.post<AirSearchIdResponse>(`${this.ENDPOINT}/${this.VERSION}/search`, airSearch, { headers: http }).pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public search(searchId: string) : Promise<boolean> {

        return new Promise((resolve) => {

            const user = this.authService.getUserValue();
    
            if (!(user instanceof AuthenticatedUser)) return;
    
            this.previousSearchId = searchId;
    
            this.results$.next([]);
    
            this.isLoading = true;
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
                    const result: AirSearchResponse = Object.assign<AirSearchResponse, any>(new AirSearchResponse(), JSON.parse(message.data));
                    result.show = true;

                    if (index >= (this.page * this.itemsPerPage)) {
                        result.show = false;
                        return;
                    }
                    result.outbounds = result.outbounds.map((option: FlightOption) => {
                        option.show= true
                        return option;
                    });

                    if(result.inbounds) {
                        result.inbounds = result.inbounds.map((option: FlightOption) => {
                            option.show = true
                            return option;
                        });
                    }
                    observer.next(result);

                    index++;

                    resolve(true);
                }
    
                eventSource.onerror = () => {
                    this.isLoading = false;
    
                    eventSource.close();

                    resolve(false);
                }
    
                return () => {
                    eventSource.close();
                }
            }).subscribe({
                next: (result: AirSearchResponse) => {
                    const results: AirSearchResults = this.results$.value;
    
                    results.push(result);
    
                    this.results$.next(results);
                }
            })
        });
    }

    nextPage(): void {
        this.page++;
        this.results$.next(
            this.results$.value.map((value: AirSearchResponse, index: number) => {
                value.show = true;

                if (index >= (this.page * this.itemsPerPage)) {
                    value.show = false;
                    return value;
                }
                return value;
            })
        )
    }

    
}