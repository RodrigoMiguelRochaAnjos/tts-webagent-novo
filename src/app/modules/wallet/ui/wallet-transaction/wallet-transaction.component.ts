import { Component, Input } from '@angular/core';
import { TransactionType } from 'src/app/shared/models/transaction-type.model';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-wallet-transaction',
  templateUrl: './wallet-transaction.component.html',
  styleUrls: ['./wallet-transaction.component.scss']
})
export class WalletTransactionComponent {
    @Input() public transaction!: Transaction;

    TransactionType= TransactionType;
}
