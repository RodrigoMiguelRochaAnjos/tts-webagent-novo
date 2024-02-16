import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { BetterFiltersComponent } from "../better-filters.component";
import { SharedModule } from "src/app/shared/shared.module";
import { NeoSelectModule } from "../../neo-select/module/neo-select.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NeoSelectModule
    ],
    declarations: [BetterFiltersComponent],
    exports: [BetterFiltersComponent],
    providers: [DatePipe]
})
export class BetterFiltersModule {}