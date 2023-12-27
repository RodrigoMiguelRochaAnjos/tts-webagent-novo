import { NgModule } from "@angular/core";
import { DashboardPageComponent } from "../dashboard-page.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlightSearchFormModule } from "src/app/modules/neo/ui/flight-search-form/module/flight-search-form.module";

@NgModule({
    declarations: [DashboardPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        FlightSearchFormModule
    ],
    exports: [DashboardPageComponent]
})
export class DashboardPageModule {}