import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
    },
    {
        path: 'search',
        loadChildren: () => import("../search/feature/search-shell/search-shell.module").then((m) => m.SearchShellModule)
    },
    {
        path: 'travellers',
        loadChildren: () => import("../traveller-details/feature/traveller-details-shell/traveller-details-shell.module").then((m) => m.TravellerDetailsShellModule)
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NeoShellRoutingModule { }