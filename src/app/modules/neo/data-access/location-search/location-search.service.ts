import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LocationSearchResponse } from "../../models/responses/location-search-response.model";

@Injectable({
    providedIn: 'root'
})
export class LocationSearchService {

    private results$: BehaviorSubject<LocationSearchResponse> = new BehaviorSubject<LocationSearchResponse>([]);

    private readonly ENDPOINT: string = `${environment.endpoints.REFERENCE_DATA}/cities_airports`;

    constructor(private httpClient: HttpClient) {}

    public getResults(): Observable<LocationSearchResponse> {
        return this.results$;
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