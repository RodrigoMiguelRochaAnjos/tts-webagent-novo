import { NgModule } from "@angular/core";
import { SettingsPageComponent } from "../settings-page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [SettingsPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule
    ],
    exports: [SettingsPageComponent]
})
export class SettingsPageModule {}