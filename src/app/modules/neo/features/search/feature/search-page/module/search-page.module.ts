import { NgModule } from "@angular/core";
import { SearchPageComponent } from "../search-page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FlightSearchFormModule } from "../../../ui/flight-search-form/module/flight-search-form.module";

@NgModule({
    declarations: [SearchPageComponent],
    imports:[
        CommonModule,
        FlightSearchFormModule,
        SharedModule
    ],
    exports: [SearchPageComponent]
})

export class SearchPageModule {}