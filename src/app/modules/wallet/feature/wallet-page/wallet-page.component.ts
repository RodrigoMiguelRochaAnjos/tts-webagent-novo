import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Balance } from 'src/app/shared/models/balance.model';
import { Transactions } from 'src/app/shared/models/transaction.model';
import { BalanceService } from 'src/app/shared/services/balance.service';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})

export class WalletPageComponent implements OnInit{

    transactions$!: Observable<Transactions>;

    InputType = InputType
 
    constructor(
        private balanceService: BalanceService
    ) {
        this.transactions$ = balanceService.getTransactions();
    }

    ngOnInit(): void {
        this.balanceService.loadTransactions(90);
    }

}

