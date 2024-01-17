import { NgModule } from "@angular/core";
import { FlightOptionPlaceComponent } from "../flight-option-place.component";
import { CommonModule, DatePipe } from "@angular/common";

@NgModule({
    declarations: [FlightOptionPlaceComponent],
    imports: [
        CommonModule,
    ],
    exports: [FlightOptionPlaceComponent],
    providers: [DatePipe]
})
export class FlightOptionPlaceModule {}