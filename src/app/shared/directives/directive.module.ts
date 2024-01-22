import { NgModule } from "@angular/core";
import { FieldLimitDirective } from "./field-limit.directive";
import { CommonModule } from "@angular/common";
import { AutoFocusDirective } from "./auto-focus.directive";
import { OnScreenDirective } from "./on-screen.directive";

@NgModule({
    declarations: [FieldLimitDirective, AutoFocusDirective, OnScreenDirective],
    imports: [
        CommonModule
    ],
    exports: [FieldLimitDirective, AutoFocusDirective, OnScreenDirective],
    providers: [FieldLimitDirective, AutoFocusDirective, OnScreenDirective]
})
export class DirectivesModule {}