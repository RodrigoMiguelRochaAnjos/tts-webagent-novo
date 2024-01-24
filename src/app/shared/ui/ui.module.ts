import { NgModule } from "@angular/core";
import { LoadingComponent } from "./loading/loading.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { NewsTemplateComponent } from "./news-template/news-template.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { InputsModule } from "./inputs/inputs.module";
import { ModalComponent } from './modal/modal.component';

@NgModule({
    declarations: [
        LoadingComponent,
        NewsTemplateComponent,
        ModalComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        InputsModule
    ],
    exports: [
        LoadingComponent,
        NewsTemplateComponent,
        InputsModule,
        ModalComponent
    ],
})
export class UIModule { }