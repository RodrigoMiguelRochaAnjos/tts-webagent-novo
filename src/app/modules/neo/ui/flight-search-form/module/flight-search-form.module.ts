import { Injectable, NgModule } from "@angular/core";
import { FlightSearchFormComponent } from "../flight-search-form.component";
import { CommonModule } from "@angular/common";
import { NeoFormModule } from "../../neo-form/module/neo-form.module";
import { NeoInputModule } from "../../neo-input/module/neo-input.module";
import { NeoRowModule } from "../../neo-row/module/neo-row.module";
import { FormsModule } from "@angular/forms";
import { NeoDatePickerModule } from "../../neo-date-picker/module/neo-date-picker.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [FlightSearchFormComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule
    ],
    exports: [FlightSearchFormComponent]
})
export class FlightSearchFormModule {}