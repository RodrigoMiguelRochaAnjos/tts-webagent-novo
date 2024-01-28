import { NgModule } from "@angular/core";
import { ErrorAlertComponent } from "./types/error-alert/error-alert.component";
import { WarningAlertComponent } from "./types/warning-alert/warning-alert.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        WarningAlertComponent,
        ErrorAlertComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        WarningAlertComponent,
        ErrorAlertComponent,
    ]
})
export class AlertModule {}