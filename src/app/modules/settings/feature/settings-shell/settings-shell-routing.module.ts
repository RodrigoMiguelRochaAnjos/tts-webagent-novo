import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingsPageComponent } from "../settings-page/settings-page.component";
import { SettingsPageModule } from "../settings-page/module/settings-page.module";

const routes: Routes = [
    {
        path: '',
        component: SettingsPageComponent,
        loadChildren: () => SettingsPageModule
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsShellRoutingModule {}