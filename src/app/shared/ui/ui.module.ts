import { NgModule } from "@angular/core";
import { NavbarComponent } from "./navbar/navbar.component";
import { NewsTemplateComponent } from "./news-template/news-template.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { InputsModule } from "./inputs/inputs.module";
import { ModalComponent } from './modal/modal.component';
import { AlertModule } from "./alerts/alert.module";
import { DefaultLoadingComponent } from './loading/types/default-loading/default-loading.component';
import { LoadingModule } from "./loading/loading.module";

@NgModule({
    declarations: [
        NewsTemplateComponent,
        ModalComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        AlertModule,
        InputsModule,
        LoadingModule
    ],
    exports: [
        NewsTemplateComponent,
        InputsModule,
        ModalComponent
    ],
})
export class UIModule { }