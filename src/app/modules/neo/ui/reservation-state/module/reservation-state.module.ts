import { NgModule } from "@angular/core";
import { ReservationStateComponent } from "../reservation-state.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [ReservationStateComponent],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [ReservationStateComponent]
})
export class ReservationStateModule {}