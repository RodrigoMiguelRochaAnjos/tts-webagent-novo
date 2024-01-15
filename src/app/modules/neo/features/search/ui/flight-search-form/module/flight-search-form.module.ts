import { NgModule } from "@angular/core";
import { FlightSearchFormComponent } from "../flight-search-form.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [FlightSearchFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule
    ],
    exports: [FlightSearchFormComponent]
})
export class FlightSearchFormModule {}