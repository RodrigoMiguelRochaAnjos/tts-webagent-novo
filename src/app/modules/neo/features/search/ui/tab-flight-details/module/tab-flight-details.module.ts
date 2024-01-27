import { NgModule } from "@angular/core";
import { TabFlightDetailsComponent } from "../tab-flight-details.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AirSegmentModule } from "src/app/modules/neo/ui/air-segment/module/air-segment.module";

@NgModule({
    declarations: [TabFlightDetailsComponent],
    imports: [
        CommonModule,
        FormsModule,
        AirSegmentModule
    ],
    exports: [TabFlightDetailsComponent]
})
export class TabFlightDetailsModule {}