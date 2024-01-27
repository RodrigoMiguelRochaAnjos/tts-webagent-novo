import { NgModule } from "@angular/core";
import { TripSummaryComponent } from "../trip-summary.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FlightOptionModule } from "../../../features/search/ui/flight-option/module/flight-option.module";
import { AirSegmentModule } from "../../air-segment/module/air-segment.module";
import { SummarySegmentModule } from "../../summary-segment/module/summary-segment.module";

@NgModule({
    declarations: [TripSummaryComponent],
    imports: [
        CommonModule,
        FlightOptionModule,
        SummarySegmentModule,
        SharedModule
    ],
    exports: [TripSummaryComponent]
})
export class TripSummaryModule {}