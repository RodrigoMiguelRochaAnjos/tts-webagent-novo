import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletTransactionComponent } from '../wallet-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [WalletTransactionComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [WalletTransactionComponent]
})
export class WalletTransactionModule { }
