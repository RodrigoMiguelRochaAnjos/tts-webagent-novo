import { NgModule } from "@angular/core";
import { FlightSearchFormComponent } from "../flight-search-form.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule } from "@angular/forms";
import { DirectivesModule } from "src/app/shared/directives/directive.module";

@NgModule({
    declarations: [FlightSearchFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DirectivesModule
    ],
    exports: [FlightSearchFormComponent],
    providers: [DirectivesModule]
})
export class FlightSearchFormModule {}