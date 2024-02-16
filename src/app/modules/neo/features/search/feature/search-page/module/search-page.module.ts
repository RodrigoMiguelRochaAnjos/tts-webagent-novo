import { NgModule } from "@angular/core";
import { SearchPageComponent } from "../search-page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FlightSearchFormModule } from "../../../ui/flight-search-form/module/flight-search-form.module";
import { SearchResultModule } from "../../../ui/search-result/module/search-result.module";
import { DirectivesModule } from "src/app/shared/directives/directive.module";
import { BetterFiltersModule } from "../../../ui/better-filters/module/better-filters.module";

@NgModule({
    declarations: [SearchPageComponent],
    imports:[
        CommonModule,
        FlightSearchFormModule,
        DirectivesModule,
        SearchResultModule,
        BetterFiltersModule,
        SharedModule
    ],
    exports: [SearchPageComponent],
    providers: [DirectivesModule]
})

export class SearchPageModule {}