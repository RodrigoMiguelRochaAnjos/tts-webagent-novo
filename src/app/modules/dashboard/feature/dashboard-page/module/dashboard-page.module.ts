import { NgModule } from "@angular/core";
import { DashboardPageComponent } from "../dashboard-page.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SearchResultModule } from "src/app/modules/neo/features/search/ui/search-result/module/search-result.module";
import { ReservationStateModule } from "src/app/modules/neo/ui/reservation-state/module/reservation-state.module";
import { TripSummaryModule } from "src/app/modules/neo/ui/trip-summary/module/trip-summary.module";
import { FlightOptionModule } from "src/app/modules/neo/features/search/ui/flight-option/module/flight-option.module";

@NgModule({
    declarations: [DashboardPageComponent],
    imports: [
        CommonModule,
        SearchResultModule,
        FormsModule,
        ReservationStateModule,
        TripSummaryModule
    ],
    exports: [DashboardPageComponent]
})
export class DashboardPageModule {}