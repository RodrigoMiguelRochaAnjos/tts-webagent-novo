import { NgModule } from "@angular/core";
import { FieldLimitDirective } from "./field-limit.directive";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [FieldLimitDirective],
    imports: [
        CommonModule
    ],
    exports: [FieldLimitDirective],
    providers: [FieldLimitDirective]
})
export class DirectivesModule {}