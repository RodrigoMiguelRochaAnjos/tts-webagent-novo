import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DateRange } from 'src/app/shared/models/date-range.model';
import { Transactions } from 'src/app/shared/models/transaction.model';
import { BalanceService } from 'src/app/shared/services/balance.service';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { DayInterval } from '../../models/day-interval.enum';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})

export class WalletPageComponent implements OnInit{
    InputType = InputType;
    DayInterval = DayInterval;

    transactions$!: Observable<Transactions>;

    numDays?: number = 30;

    dateRange: DateRange = new DateRange();
    constructor(
        private balanceService: BalanceService,
        private router: Router
    ) {
        this.transactions$ = balanceService.getTransactions();

        this.balanceService.resetTransactions();
    }

    ngOnInit(): void {
        this.balanceService.loadTransactions(this.numDays);
    }

    get dayIntervals(): string[] {
        return Object.values(this.DayInterval);
    }

    updateTransactions(): void {
        this.balanceService.resetTransactions();
        this.balanceService.loadTransactions(this.numDays, this.dateRange.from?.format("YYYY-MM-DD"), this.dateRange.to?.format("YYYY-MM-DD"));
    }

    updateDays(choice: DayInterval): void {
        switch(choice) {
            case DayInterval.YESTERDAY:
                this.numDays = 1;
                break;
            case DayInterval.LAST_7_DAYS:
                this.numDays = 7;
                break;
            case DayInterval.LAST_30_DAYS:
                this.numDays = 30;
                break;
            case DayInterval.LAST_90_DAYS:
                this.numDays = 90;
                break;
            case DayInterval.ALL_TIME:
                this.numDays = undefined;
                break;
        }

        this.updateTransactions();
    }
}

