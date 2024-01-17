import { NgModule } from "@angular/core";
import { FlightOptionComponent } from "../../flight-option/flight-option.component";
import { CommonModule, DatePipe } from "@angular/common";
import { FlightOptionTimeComponent } from "../flight-option-time.component";

@NgModule({
    declarations: [FlightOptionTimeComponent],
    imports: [
        CommonModule,
    ],
    exports: [FlightOptionTimeComponent],
    providers: [DatePipe]
})
export class FlightOptionTimeModule {}