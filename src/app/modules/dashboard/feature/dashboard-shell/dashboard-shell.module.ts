import { NgModule } from "@angular/core";
import { DashBoardShellRoutingModule } from "./dashboard-shell-routing.module";

@NgModule({
    imports: [DashBoardShellRoutingModule],
    exports: [DashBoardShellRoutingModule]
})
export class DashBoardShellModule {}