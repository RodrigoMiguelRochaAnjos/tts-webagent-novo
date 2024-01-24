import { NgModule } from "@angular/core";
import { DashboardPageComponent } from "../dashboard-page.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SearchResultModule } from "src/app/modules/neo/features/search/ui/search-result/module/search-result.module";

@NgModule({
    declarations: [DashboardPageComponent],
    imports: [
        CommonModule,
        SearchResultModule,
        FormsModule,
    ],
    exports: [DashboardPageComponent]
})
export class DashboardPageModule {}