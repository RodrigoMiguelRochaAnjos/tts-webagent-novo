import { NgModule } from "@angular/core";
import { TabPriceDetailsComponent } from "../tab-price-details.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [TabPriceDetailsComponent],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        TabPriceDetailsComponent
    ]
})
export class TabPriceDetailsModule {}