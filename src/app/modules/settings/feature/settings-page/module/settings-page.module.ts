import { NgModule } from "@angular/core";
import { SettingsPageComponent } from "../settings-page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [SettingsPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [SettingsPageComponent]
})
export class SettingsPageModule {}