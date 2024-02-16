import { Component, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { Transactions } from 'src/app/shared/models/transaction.model';
import { BalanceService } from 'src/app/shared/services/balance.service';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { DayInterval } from '../../models/day-interval.enum';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DestroyService } from 'src/app/core/services/destroy.service';
import { ModalControllerService } from 'src/app/core/services/modal-controller.service';
import { Deposit } from 'src/app/shared/models/deposit.model';
import { patterns } from 'src/app/shared/utils/validation-patterns';
import * as moment from 'moment';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})

export class WalletPageComponent implements OnInit{
    InputType = InputType;
    DayInterval = DayInterval;
    patterns = patterns

    transactions$!: Observable<Transactions>;

    public deposit: Deposit = new Deposit();

    numDays?: number = 30;

    dateRange: DateRange = new DateRange();
    constructor(
        private balanceService: BalanceService,
        private modalService: ModalControllerService,
        private router: Router
    ) {
        this.transactions$ = balanceService.getTransactions();

        this.balanceService.resetTransactions();
    }

    ngOnInit(): void {
        this.updateTransactions();
    }

    get daysIntervalValues(): string[] {
        return Object.values(this.DayInterval);
    }

    updateTransactions(): void {
        if(this.dateRange == null) return;
        
        this.balanceService.resetTransactions();
        this.balanceService.loadTransactions(this.dateRange.dateFrom?.format("YYYY-MM-DD"), this.dateRange.dateTo?.format("YYYY-MM-DD"));
    }

    toggleModal(content: any, modalId: string) {
        this.modalService.showModal(content, modalId);
    }

    addFunds(): void {
        this.deposit.currency = "USD";
        if(!this.deposit.isValid()) return;

        this.balanceService.addFunds(this.deposit);

    }
}

