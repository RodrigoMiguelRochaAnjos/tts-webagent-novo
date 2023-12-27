import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardPageComponent } from "../dashboard-page/dashboard-page.component";
import { DashboardPageModule } from "../dashboard-page/module/dashboard-page.module";

const routes: Routes = [
    {
        path: '',
        component: DashboardPageComponent,
        loadChildren: () => DashboardPageModule
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DashBoardShellRoutingModule {}