import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravellerDetailsPageComponent } from '../traveller-details-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ReservationStateModule } from 'src/app/modules/neo/ui/reservation-state/module/reservation-state.module';
import { TripSummaryModule } from 'src/app/modules/neo/ui/trip-summary/module/trip-summary.module';



@NgModule({
    declarations: [TravellerDetailsPageComponent],
    exports: [TravellerDetailsPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        TripSummaryModule,
        ReservationStateModule
    ]
})
export class TravellerDetailsPageModule { }
