import { NgModule } from "@angular/core";
import { FlightSelectionIndicatorComponent } from "../flight-selection-indicator.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ FlightSelectionIndicatorComponent],
    imports: [
        CommonModule,
    ],
    exports: [ FlightSelectionIndicatorComponent],
})
export class FlightSelectionIndicatorModule {}