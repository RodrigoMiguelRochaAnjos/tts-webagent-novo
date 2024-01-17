import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/home/feature/home-page/home-page.component';
import { AuthGuardService } from './core/authentication/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/feature/home-shell/home-shell.module').then((m) => m.HomeShellModule),
        canActivateChild: [AuthGuardService],
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/home/feature/home-shell/home-shell.module').then((m) => m.HomeShellModule),
        canActivateChild: [AuthGuardService],
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/feature/dashboard-shell/dashboard-shell.module').then((m) => m.DashBoardShellModule),
        canActivateChild: [AuthGuardService],
        title: 'Dashboard'
    },
    {
        path: 'neo',
        loadChildren: () => import('./modules/neo/features/neo-shell/neo-shell.module').then((m) => m.NeoShellModule),
        canActivateChild: [AuthGuardService],
        title: 'NEO'
    },
    {
        path: 'settings',
        loadChildren: () => import('./modules/settings/feature/settings-shell/settings-shell.module').then((m) => m.SettingsShellModule),
        title: 'Settings'
    },
    {
        path: 'wallet',
        loadChildren: () => import('./modules/wallet/feature/wallet-shell/wallet-shell.module').then((m) => m.WalletShellModule),
        canActivateChild: [AuthGuardService],
        title: 'Wallet'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
    providers: [AuthGuardService]
})
export class AppRoutingModule { }
