import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerminalPage } from '../terminal-page/terminal.page';

const routes: Routes = [
    {
        path: '',
        component: TerminalPage,
        loadChildren: () => import('../terminal-page/module/terminal.module').then((m) => m.TerminalPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TerminalShellRoutingModule { }
