import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SearchResultComponent } from "../search-result.component";
import { FlightSelectionIndicatorModule } from "../../flight-selection-indicator/module/flight-selection-indicator.module";
import { TabDestInfoModule } from "../../tab-dest-info/module/tab-dest-info.module";
import { TabFlightDetailsModule } from "../../tab-flight-details/module/tab-flight-details.module";
import { TabPriceDetailsModule } from "../../tab-price-details/module/tab-price-details.module";
import { FlightOptionModule } from "../../flight-option/module/flight-option.module";
import { SharedModule } from "src/app/shared/shared.module";


@NgModule({
    declarations: [SearchResultComponent],
    exports: [SearchResultComponent],
    imports: [
        CommonModule,
        FormsModule,
        FlightOptionModule,
        TabFlightDetailsModule,
        TabPriceDetailsModule,
        TabDestInfoModule,
        FlightSelectionIndicatorModule,
        SharedModule
    ],
})
export class SearchResultModule {}