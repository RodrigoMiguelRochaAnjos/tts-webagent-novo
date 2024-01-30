import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import { LocationSearchResponse } from "../../models/responses/location-search-response.model";
import { DestroyService } from "src/app/core/services/destroy.service";

@Injectable({
    providedIn: 'root'
})
export class LocationSearchService {

    private results$: BehaviorSubject<LocationSearchResponse> = new BehaviorSubject<LocationSearchResponse>([]);

    private readonly ENDPOINT: string = `${environment.endpoints.REFERENCE_DATA}/cities_airports`;

    constructor(
        private httpClient: HttpClient,
        private destroyService: DestroyService
        ) {}

    public getResults(): Observable<LocationSearchResponse> {
        return this.results$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public search(term: string) : void {
        this.httpClient.get<LocationSearchResponse>(`${this.ENDPOINT}/${term}`).subscribe({
            next: (result: LocationSearchResponse) => {
                this.results$.next(result);
            }
        })
    }

    public reset(): void {
        this.results$.next([]);
    }
}