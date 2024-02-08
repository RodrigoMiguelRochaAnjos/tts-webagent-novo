import { NgModule } from "@angular/core";
import { DefaultLoadingComponent } from "./types/default-loading/default-loading.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [DefaultLoadingComponent],
    imports: [
        CommonModule
    ],
    exports: [DefaultLoadingComponent]
})
export class LoadingModule {}