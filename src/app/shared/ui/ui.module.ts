import { NgModule } from "@angular/core";
import { LoadingComponent } from "./loading/loading.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { NewsTemplateComponent } from "./news-template/news-template.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { InputsModule } from "./inputs/inputs.module";

@NgModule({
    declarations: [
        LoadingComponent,
        NewsTemplateComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        InputsModule
    ],
    exports: [
        LoadingComponent,
        NewsTemplateComponent,
        InputsModule
    ],
})
export class UIModule { }