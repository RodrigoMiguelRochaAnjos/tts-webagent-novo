import { NgModule } from "@angular/core";
import { DestinationInfoComponent } from "../destination-info.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [DestinationInfoComponent],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class DestinationInfoModule {}