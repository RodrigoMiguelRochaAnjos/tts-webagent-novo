import { NgModule } from "@angular/core";
import { NeoShellRoutingModule } from "./neo-shell-routing.module";

@NgModule({
    imports: [NeoShellRoutingModule],
    exports: [NeoShellRoutingModule]
})
export class NeoShellModule {}