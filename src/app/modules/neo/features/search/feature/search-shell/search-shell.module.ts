import { NgModule } from "@angular/core";
import { SearchShellRoutingModule } from "./search-shell-routing.module";

@NgModule({
    imports: [SearchShellRoutingModule],
    exports: [SearchShellRoutingModule]
})
export class SearchShellModule {}