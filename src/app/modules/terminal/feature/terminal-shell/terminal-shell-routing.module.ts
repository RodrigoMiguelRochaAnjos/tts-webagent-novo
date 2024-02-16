import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerminalPage } from '../terminal-page/terminal.page';
import { DestinationInfoComponent } from '../destination-info/destination-info.component';

const routes: Routes = [
    {
        path: '',
        component: TerminalPage,
        loadChildren: () => import('../terminal-page/module/terminal.module').then((m) => m.TerminalPageModule)
    },
    {
        path: 'destination/info/:destinations',
        component: DestinationInfoComponent,
        loadChildren: () => import('../destination-info/module/destination-info.module').then((m) => m.DestinationInfoModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TerminalShellRoutingModule { }
