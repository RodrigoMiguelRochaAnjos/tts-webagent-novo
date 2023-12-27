import { NgModule } from "@angular/core";
import { NeoRowComponent } from "../neo-row.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [NeoRowComponent],
    imports: [
        CommonModule,
    ],
    exports: [NeoRowComponent]
})
export class NeoRowModule {}