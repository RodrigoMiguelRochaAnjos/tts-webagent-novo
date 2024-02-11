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
        title: 'DASHBOARD'
    },
    {
        path: 'neo',
        loadChildren: () => import('./modules/neo/features/neo-shell/neo-shell.module').then((m) => m.NeoShellModule),
        canActivateChild: [AuthGuardService],
        title: 'NEO',
        data: {
            icon: 'fa-solid fa-plane'
        }
    },
    {
        path: 'terminal',
        loadChildren: () => import('./modules/terminal/feature/terminal-shell/terminal-shell.module').then((m) => m.TerminalShellModule),
        canActivateChild: [AuthGuardService],
        title: 'TERMINAL',
        data: {
            icon: 'fa-solid fa-terminal'
        }
    },
    {
        path: 'settings',
        loadChildren: () => import('./modules/settings/feature/settings-shell/settings-shell.module').then((m) => m.SettingsShellModule),
        title: 'SETTINGS',
        data: {
            icon: 'fa-solid fa-cog'
        }
    },
    {
        path: 'wallet',
        loadChildren: () => import('./modules/wallet/feature/wallet-shell/wallet-shell.module').then((m) => m.WalletShellModule),
        canActivateChild: [AuthGuardService],
        title: 'WALLET',
        data: {
            icon: 'fa-solid fa-wallet'
        }
    },
    {
        path: 'my-bookings',
        loadChildren: () => import('./modules/neo/features/my-bookings/feature/my-bookings-shell/my-bookings-shell.module').then((m) => m.MyBookingsShellModule),
        canActivateChild: [AuthGuardService],
        title: 'MY_BOOKINGS',
        data: {
            icon: 'fa-solid fa-wallet'
        }
    },
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
    providers: [AuthGuardService]
})
export class AppRoutingModule { }
