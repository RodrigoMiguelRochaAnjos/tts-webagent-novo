import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutShellRoutingModule } from './checkout-shell-routing.module';



@NgModule({
  imports: [CheckoutShellRoutingModule],
  exports: [CheckoutShellRoutingModule]
})
export class CheckoutShellModule {}
