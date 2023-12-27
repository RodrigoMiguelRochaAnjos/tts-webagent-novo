import { NgModule } from "@angular/core";
import { NeoDatePickerComponent } from "../neo-date-picker.component";
import { CommonModule } from "@angular/common";
import { NeoInputModule } from "../../neo-input/module/neo-input.module";
import { NeoRowModule } from "../../neo-row/module/neo-row.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [NeoDatePickerComponent],
    imports: [
        CommonModule,
        NeoInputModule,
        NeoRowModule,
        FormsModule
    ],
    exports: [NeoDatePickerComponent]
})
export class NeoDatePickerModule {}