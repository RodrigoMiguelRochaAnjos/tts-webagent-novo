import { NgModule } from "@angular/core";
import { FlightOptionComponent } from "../flight-option.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlightOptionPlaceModule } from "../../flight-option-place/module/flight-option-place.module";
import { FlightOptionTimeModule } from "../../flight-option-time/module/flight-option-time.module";
import { FlightSelectionIndicatorModule } from "../../flight-selection-indicator/module/flight-selection-indicator.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [FlightOptionComponent],
    exports: [FlightOptionComponent],
    imports: [
        FormsModule,
        CommonModule,
        FlightOptionTimeModule,
        FlightOptionPlaceModule,
        FlightSelectionIndicatorModule,
        SharedModule
    ]
})
export class FlightOptionModule {}