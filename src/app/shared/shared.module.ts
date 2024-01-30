import { NgModule } from "@angular/core";
import { UIModule } from "./ui/ui.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [],
    imports: [
        UIModule
    ],
    exports: [
        UIModule,
        TranslateModule
    ],
})
export class SharedModule {}