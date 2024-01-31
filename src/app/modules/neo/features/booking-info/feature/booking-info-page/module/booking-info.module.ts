import { NgModule } from "@angular/core";
import { BookingInfoComponent } from "../booking-info.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FlightOptionsInfoModule } from "../../../ui/flight-options-info/module/flight-options-info.module";

@NgModule({
    declarations: [BookingInfoComponent],
    imports: [
        CommonModule,
        FlightOptionsInfoModule,
        SharedModule
    ],
    exports: [BookingInfoComponent],
})
export class BookingInfoModule {}