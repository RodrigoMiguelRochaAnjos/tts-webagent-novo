import { NgModule } from "@angular/core";
import { AirSegmentComponent } from "../air-segment.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [AirSegmentComponent],
    imports:[CommonModule, SharedModule],
    exports: [AirSegmentComponent]
})
export class AirSegmentModule {}