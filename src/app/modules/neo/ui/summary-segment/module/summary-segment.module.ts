import { NgModule } from "@angular/core";
import { SummarySegmentComponent } from "../summary-segment.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [SummarySegmentComponent],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [SummarySegmentComponent]
})
export class SummarySegmentModule {}