import { NgModule } from "@angular/core";
import { TabPriceDetailsComponent } from "../tab-price-details.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [TabPriceDetailsComponent],
    imports: [
        CommonModule,
    ],
    exports: [
        TabPriceDetailsComponent
    ]
})
export class TabPriceDetailsModule {}