import { NgModule } from "@angular/core";
import { TabFlightDetailsComponent } from "../tab-flight-details.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [TabFlightDetailsComponent],
    imports: [
        CommonModule,
        FormsModule,
    ],
    exports: [TabFlightDetailsComponent]
})
export class TabFlightDetailsModule {}