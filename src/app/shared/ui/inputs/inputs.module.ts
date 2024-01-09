import { NgModule } from "@angular/core";
import { WebagentDropdownComponent } from "./types/webagent-dropdown/webagent-dropdown.component";
import { WebagentInputComponent } from "./webagent-input/webagent-input.component";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { WebagentBaseComponent } from './types/webagent-base/webagent-base.component';
import { WebagentTextComponent } from './types/webagent-text/webagent-text.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WebagentLocationSearchComponent } from './types/webagent-location-search/webagent-location-search.component';
import { WebagentDateComponent } from './types/webagent-date/webagent-date.component';
import { WebagentDateRangeComponent } from './types/webagent-date-range/webagent-date-range.component';
import { WebagentCvvComponent } from "./types/webagent-cvv/webagent-cvv.component";

@NgModule({
    declarations: [
        WebagentInputComponent,
        WebagentDropdownComponent,
        WebagentBaseComponent,
        WebagentTextComponent,
        WebagentLocationSearchComponent,
        WebagentDateComponent,
        WebagentDateRangeComponent,
        WebagentCvvComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        WebagentInputComponent,
    ],
    providers: [
    ],
    bootstrap: [WebagentInputComponent]
})
export class InputsModule {}