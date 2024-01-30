import { Component } from '@angular/core';
import { ReservationService } from '../../data-access/reservation.service';
import { Observable } from 'rxjs';
import { ReservationProcess, ReservationProcessesState } from '../../features/search/models/reservation-process.enum';

@Component({
  selector: 'reservation-state',
  templateUrl: './reservation-state.component.html',
  styleUrls: ['./reservation-state.component.scss']
})
export class ReservationStateComponent {
    promiseTest: Promise<boolean> = Promise.resolve(false);
    reservationProcess$!: Observable<ReservationProcessesState>;

    fundsChecked: boolean = false;
    airCheckoutDetails: boolean = false;
    travellerDetailsValid: boolean = false;
    airCheckoutPrice: boolean = false;
    booking: boolean = false;


    constructor(
        private reservationService: ReservationService
    ) {
        this.reservationProcess$ = this.reservationService.getProgress();

        this.reservationProcess$.subscribe({
            next: (state: ReservationProcessesState) => {
                console.log(state);
                state.FUNDS_CHECKED.then((complete: boolean) => this.fundsChecked = complete);
                state.AIR_CHECKOUT_DETAILS.then((complete: boolean) => this.airCheckoutDetails = complete);
                state.TRAVELLER_DETAILS_VALID.then((complete: boolean) => this.travellerDetailsValid = complete);
                state.AIR_CHECKOUT_PRICE.then((complete: boolean) => this.airCheckoutPrice = complete);
                state.BOOKING.then((complete: boolean) => this.booking = complete);
            }
        })
    }

    async getPromiseValue(promise: Promise<boolean> | boolean) {
        return promise;
    }
}
