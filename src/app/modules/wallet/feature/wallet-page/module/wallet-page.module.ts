import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletPageComponent } from '../wallet-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WalletTransactionModule } from "../../../ui/wallet-transaction/module/wallet-transaction.module";
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [WalletPageComponent],
    exports: [WalletPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        WalletTransactionModule,
    ]
})
export class WalletPageModule { }
