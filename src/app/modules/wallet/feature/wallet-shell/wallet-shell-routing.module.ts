import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WalletPageComponent } from '../wallet-page/wallet-page.component';
import { WalletPageModule } from '../wallet-page/module/wallet-page.module';



const routes: Routes = [
  {
      path: '',
      component: WalletPageComponent,
      loadChildren: () => WalletPageModule
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletShellRoutingModule { }
