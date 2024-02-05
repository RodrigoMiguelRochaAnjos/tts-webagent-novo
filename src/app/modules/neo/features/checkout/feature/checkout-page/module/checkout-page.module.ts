import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CheckoutPageComponent } from '../checkout-page.component';
import { TripSummaryModule } from 'src/app/modules/neo/ui/trip-summary/module/trip-summary.module';
import { ReservationStateModule } from 'src/app/modules/neo/ui/reservation-state/module/reservation-state.module';



@NgModule({
    declarations: [CheckoutPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        TripSummaryModule,
        ReservationStateModule,
        FormsModule
    ],
    exports: [CheckoutPageComponent]
})
export class CheckoutPageModule { }
