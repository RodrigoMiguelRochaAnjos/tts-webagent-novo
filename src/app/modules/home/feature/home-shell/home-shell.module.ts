import { NgModule } from "@angular/core";
import { HomeShellRoutingModule } from "./home-shell-routing.module";

@NgModule({
    imports: [HomeShellRoutingModule],
    exports: [HomeShellRoutingModule]
})
export class HomeShellModule { }