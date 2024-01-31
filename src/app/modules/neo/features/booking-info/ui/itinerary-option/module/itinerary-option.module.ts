import { NgModule } from "@angular/core";
import { ItineraryOptionComponent } from "../itinerary-option.component";
import { SharedModule } from "src/app/shared/shared.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ItineraryOptionComponent],
    imports: [CommonModule, SharedModule],
    exports: [ItineraryOptionComponent],
})
export class ItineraryOptionModule {}