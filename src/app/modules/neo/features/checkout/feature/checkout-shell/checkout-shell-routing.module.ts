import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutPageComponent } from '../checkout-page/checkout-page.component';
import { CheckoutPageModule } from '../checkout-page/module/checkout-page.module';

const routes: Routes = [
  {
      path: '',
      component: CheckoutPageComponent,
      loadChildren: () => CheckoutPageModule,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutShellRoutingModule {}
