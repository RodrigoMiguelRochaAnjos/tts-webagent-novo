import { NgModule } from "@angular/core";
import { SearchPageComponent } from "../search-page.component";
import { CommonModule } from "@angular/common";
import { FlightSearchFormModule } from "src/app/modules/neo/ui/flight-search-form/module/flight-search-form.module";

@NgModule({
    declarations: [SearchPageComponent],
    imports:[
        CommonModule,
        FlightSearchFormModule
    ],
    exports: [SearchPageComponent]
})

export class SearchPageModule {}