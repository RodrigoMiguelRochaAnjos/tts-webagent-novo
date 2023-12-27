import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchPageComponent } from "../search-page/search-page.component";
import { SearchPageModule } from "../search-page/module/search-page.module";

const routes: Routes = [
    {
        path: '',
        component: SearchPageComponent,
        loadChildren: () => SearchPageModule,
    },
    {
        path: ':id',
        component: SearchPageComponent,
        loadChildren: () => SearchPageModule
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchShellRoutingModule { }