import { NgModule } from "@angular/core";
import { UIModule } from "./ui/ui.module";
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "./pipes/pipes.module";

@NgModule({
    declarations: [],
    imports: [
        UIModule,
        PipesModule
    ],
    exports: [
        UIModule,
        PipesModule,
        TranslateModule
    ],
    providers: [PipesModule]
})
export class SharedModule {}