import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import { AirCheckoutDetailsResponse } from "../features/search/models/air-checkout-details-response.model";
import { AirCheckoutPriceRequest } from "../features/search/models/air-checkout-price-request.model";
import { AirCheckoutDetailsRequest } from "../features/search/models/air-checkout-details-request.model";
import { HttpClient } from "@angular/common/http";
import { AirCheckoutPriceResponse } from "../features/search/models/air-checkout-price-response.model";
import { AuthService } from "src/app/core/authentication/auth.service";
import { User } from "src/app/core/models/user/user.model";
import { AuthenticatedUser } from "src/app/core/models/user/types/authenticated-user.model";
import { DestroyService } from "src/app/core/services/destroy.service";

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {
    private readonly VERSION: string = 'v1';
    private readonly ENDPOINT: string = `${environment.endpoints.NEO}/${this.VERSION}/bookings`;

    private details$: BehaviorSubject<AirCheckoutDetailsResponse | null> = new BehaviorSubject<AirCheckoutDetailsResponse | null>(null);
    private price$: BehaviorSubject<AirCheckoutPriceResponse | null> = new BehaviorSubject<AirCheckoutPriceResponse | null>(null);

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
        private destroyService: DestroyService
    ) { }

    public getDetails(): Observable<AirCheckoutDetailsResponse | null> {
        return this.details$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getDetailsValue(): AirCheckoutDetailsResponse | null {
        return this.details$.value;
    }

    public getPrice(): Observable<AirCheckoutPriceResponse | null> {
        return this.price$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getPriceValue(): AirCheckoutPriceResponse | null {
        return this.price$.value;
    }

    async loadDetails(body: AirCheckoutDetailsRequest): Promise<void> {

        return new Promise<void>((resolve) => {
            this.authService.getUser().subscribe((user: User) => {
                if(!(user instanceof AuthenticatedUser)) return;
                
                this.httpClient.post<AirCheckoutDetailsResponse>(`${this.ENDPOINT}/checkout-details`, body, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`
                    }
                }).subscribe({
                    next: (response: AirCheckoutDetailsResponse) => this.details$.next(response),
                    error: () => {
                        resolve();
                        this.details$.next(null)
                    },
                    complete: () => resolve()
                });
            })
        })
    }

    loadPrice(body: AirCheckoutPriceRequest): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            this.httpClient.post<AirCheckoutPriceResponse>(`${this.ENDPOINT}/checkout-price`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`
                }
            }).subscribe({
                next: (response: AirCheckoutPriceResponse) => this.price$.next(response),
                error: () => this.price$.next(null)
            });
        });
    }
}