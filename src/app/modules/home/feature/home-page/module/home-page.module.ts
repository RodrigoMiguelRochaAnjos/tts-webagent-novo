import { NgModule } from "@angular/core";
import { HomePageComponent } from "../home-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [HomePageComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
    ],
    exports: [HomePageComponent]
})
export class HomePageModule {}
