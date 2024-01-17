import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletTransactionComponent } from '../wallet-transaction.component';



@NgModule({
  declarations: [WalletTransactionComponent],
  imports: [
    CommonModule
  ],
  exports: [WalletTransactionComponent]
})
export class WalletTransactionModule { }
