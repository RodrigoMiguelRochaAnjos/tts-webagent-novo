import { NgModule } from "@angular/core";
import { NeoFormComponent } from "../neo-form.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [NeoFormComponent],
    imports: [
        CommonModule,
    ],
    exports: [NeoFormComponent]
})
export class NeoFormModule {}