import { NgModule } from "@angular/core";
import { DashboardPageComponent } from "../dashboard-page.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [DashboardPageComponent],
    imports: [
        CommonModule,
        FormsModule,
    ],
    exports: [DashboardPageComponent]
})
export class DashboardPageModule {}