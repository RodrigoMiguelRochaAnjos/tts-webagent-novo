import { NgModule } from "@angular/core";
import { NeoSelectComponent } from "../neo-select.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [NeoSelectComponent],
    imports: [CommonModule],
    exports: [NeoSelectComponent]
})
export class NeoSelectModule {}