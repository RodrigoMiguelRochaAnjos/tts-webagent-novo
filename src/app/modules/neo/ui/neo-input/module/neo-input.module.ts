import { NgModule, forwardRef } from "@angular/core";
import { NeoInputComponent } from "../neo-input.component";
import { CommonModule } from "@angular/common";
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [NeoInputComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        NeoInputComponent
    ]
})
export class NeoInputModule {}