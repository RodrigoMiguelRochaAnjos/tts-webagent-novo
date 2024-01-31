import { NgModule } from "@angular/core";
import { FlightOptionsInfoComponent } from "../flight-options-info.component";
import { SharedModule } from "src/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { ItineraryOptionModule } from "../../itinerary-option/module/itinerary-option.module";

@NgModule({
    declarations: [FlightOptionsInfoComponent],
    imports: [
        CommonModule,
        ItineraryOptionModule,
        SharedModule
    ],
    exports: [FlightOptionsInfoComponent]
})
export class FlightOptionsInfoModule {}