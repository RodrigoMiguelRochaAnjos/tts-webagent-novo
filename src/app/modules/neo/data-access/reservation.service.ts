import { Injectable } from "@angular/core";
import { BalanceService } from "src/app/shared/services/balance.service";

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    public reservationProcess: { [key: string]: Promise<boolean> } = {
        'FUNDS_CHECKED': Promise.resolve(false),
        'AIR_CHECKOUT_DETAILS': Promise.resolve(false),
        'TRAVELLER_DETAILS_VALID': Promise.resolve(false),
        'AIR_CHECKOUT_PRICE': Promise.resolve(false),
        'BOOKING': Promise.resolve(false)
    };

    constructor(
        private balanceService: BalanceService
    ) {
        const reservationProgress: string | null = localStorage.getItem("reservationProgress");

        if(reservationProgress == null) return;
        
        this.reservationProcess = JSON.parse(reservationProgress) as { [key: string]: Promise<boolean> };
    }
    
    public checkFunds(): ReservationService {
        this.reservationProcess['FUNDS_CHECKED'] = Promise.resolve(true);

        this.saveProcess();
        return this;
    }

    private saveProcess() {
        localStorage.setItem("reservationProgress", JSON.stringify(this.reservationProcess));
    }
}