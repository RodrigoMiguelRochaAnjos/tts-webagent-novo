import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { BalanceService } from "src/app/shared/services/balance.service";
import { ReservationProcess, ReservationProcessesState } from "../features/search/models/reservation-process.enum";
import { Balance } from "src/app/shared/models/balance.model";
import { FlightOption } from "../models/flight-option.model";

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    activeResult?: string;
    
    private selectedFlights$: BehaviorSubject<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }> = new BehaviorSubject<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }>({ "OUTBOUNDS": null, "INBOUNDS": null });
    
    private balance$!: Observable<Balance>;
    private reservationProcess$: BehaviorSubject<ReservationProcessesState> = new BehaviorSubject<ReservationProcessesState>({
        SELECT_FLIGHTS: Promise.resolve(false),
        FUNDS_CHECKED: Promise.resolve(false),
        AIR_CHECKOUT_DETAILS: Promise.resolve(false),
        TRAVELLER_DETAILS_VALID: Promise.resolve(false),
        AIR_CHECKOUT_PRICE: Promise.resolve(false),
        BOOKING: Promise.resolve(false),
    });
    

    constructor(
        private balanceService: BalanceService
    ) {
        this.balance$ = this.balanceService.getBalance();
        const reservationProgress: string | null = localStorage.getItem("reservationProgress");

        if(reservationProgress == null) return;
        
        this.reservationProcess$.next(JSON.parse(reservationProgress) as ReservationProcessesState);
    }

    public getSelectedFlights(): Observable<{ [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null }> {
        return this.selectedFlights$;
    }

    public getSelectedFlightsValue(): { [key in "INBOUNDS" | "OUTBOUNDS"]: FlightOption | null } {
        return this.selectedFlights$.value;
    }
    
    public checkFunds(): ReservationService {
        this.balance$.subscribe({
            next: (balance: Balance) => {
                balance.amount >= 4.5
            }
        })
        const tmp: ReservationProcessesState = this.reservationProcess$.value;

        tmp.FUNDS_CHECKED = Promise.resolve(true);

        this.reservationProcess$.next(tmp);

        this.saveProcess();
        return this;
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

    private saveProcess() {
        localStorage.setItem("reservationProgress", JSON.stringify(this.reservationProcess$.value));
    }
}