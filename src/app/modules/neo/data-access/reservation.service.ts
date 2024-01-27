import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { BalanceService } from "src/app/shared/services/balance.service";
import { ReservationProcess, ReservationProcessesState } from "../features/search/models/reservation-process.enum";
import { Balance } from "src/app/shared/models/balance.model";
import { FlightOption } from "../models/flight-option.model";
import { Providers } from "../models/providers.enum";
import { AirCheckoutDetailsRequest } from "../features/search/models/air-checkout-details-request.model";
import { AirCheckoutDetailsResponse } from "../features/search/models/air-checkout-details-response.model";
import { CheckoutService } from "./checkout.service";

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    activeResult?: string;
    
    private selectedFlights$: BehaviorSubject<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }> = new BehaviorSubject<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }>({ "OUTBOUNDS": null, "INBOUNDS": null });
    
    private balance$!: Observable<Balance>;
    private checkoutDetails$!: Observable<AirCheckoutDetailsResponse | null>;

    private reservationProcess$: BehaviorSubject<ReservationProcessesState> = new BehaviorSubject<ReservationProcessesState>({
        FUNDS_CHECKED: new Promise<boolean>((resolve) => resolve(false)),
        AIR_CHECKOUT_DETAILS: new Promise<boolean>((resolve) => resolve(false)),
        TRAVELLER_DETAILS_VALID: new Promise<boolean>((resolve) => resolve(false)),
        AIR_CHECKOUT_PRICE: new Promise<boolean>((resolve) => resolve(false)),
        BOOKING: new Promise<boolean>((resolve) => resolve(false)),
    });
    

    constructor(
        private balanceService: BalanceService,
        private checkoutService: CheckoutService
    ) {
        this.balance$ = this.balanceService.getBalance();
        this.checkoutDetails$ = this.checkoutService.getDetails();
    }

    public getSelectedFlights(): Observable<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }> {
        return this.selectedFlights$;
    }

    public getSelectedFlightsValue(): { [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null } {
        return this.selectedFlights$.value;
    }
    
    public checkFunds(): Promise<boolean> {
        this.balance$.subscribe({
            next: (balance: Balance) => {
                let totalFee: number = 0;

                for (let key of Object.keys(this.selectedFlights$.value)) {
                    if (this.selectedFlights$.value[key as "INBOUNDS" | "OUTBOUNDS"]?.provider == Providers.TRAVELFUSION) totalFee += 4.5;
                }

                const tmp: ReservationProcessesState = this.reservationProcess$.value;

                tmp.FUNDS_CHECKED = Promise.resolve(balance.amount >= totalFee);

                this.reservationProcess$.next(tmp);

                this.saveProcess();

            },
        })
        

        return this.reservationProcess$.value.FUNDS_CHECKED;
    }

    public async getCheckoutDetails(body: AirCheckoutDetailsRequest): Promise<boolean> {
        await this.checkoutService.loadDetails(body);
        
        this.checkoutDetails$.subscribe({
            next: (response: AirCheckoutDetailsResponse | null) => {
                const tmp: ReservationProcessesState = this.reservationProcess$.value;

                tmp.AIR_CHECKOUT_DETAILS = Promise.resolve(response != null);

                this.reservationProcess$.next(tmp);
            }
        });

        return this.reservationProcess$.value.AIR_CHECKOUT_DETAILS
    }

    public isOptionSelected(id: string): boolean {
        for(let option of Object.keys(this.selectedFlights$.value)) {
            if (this.selectedFlights$.value[option as "INBOUNDS" | "OUTBOUNDS"] == null) continue;
            if (this.selectedFlights$.value[option as "INBOUNDS" | "OUTBOUNDS"]!.id == id) return true;
        }

        return false;
    }

    public selectFlight(option: FlightOption, type: 'INBOUNDS' | 'OUTBOUNDS'): void {
        let flights: { [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null } = this.selectedFlights$.value;
        flights[type] = option;

        this.selectedFlights$.next(flights);
    }

    public getProgress(): Observable<ReservationProcessesState> {
        return this.reservationProcess$;
    }

    private saveProcess() {
        localStorage.setItem("reservationProgress", JSON.stringify(this.reservationProcess$.value));
    }

    canBook(resultId: string, roundtrip: boolean): boolean {
        if (!this.selectedFlights$.value) return false;
        if (resultId != this.activeResult) return false;
        if (!this.selectedFlights$.value.OUTBOUNDS) return false;
        if (!this.selectedFlights$.value.INBOUNDS && roundtrip) return false;
        return true;
    }

    resetSelection(): void {
        this.selectedFlights$.next({ "OUTBOUNDS": null, "INBOUNDS": null });
    }
}