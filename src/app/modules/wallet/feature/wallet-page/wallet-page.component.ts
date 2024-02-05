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

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})

export class WalletPageComponent implements OnInit{
    InputType = InputType;
    DayInterval = DayInterval;

    transactions$!: Observable<Transactions>;

    // translatedDaysInterval: string[] = [];

    numDays?: number = 30;

    dateRange: DateRange = new DateRange();
    constructor(
        private balanceService: BalanceService,
        private translate: TranslateService,
        private destroyService: DestroyService,
        private router: Router
    ) {
        this.transactions$ = balanceService.getTransactions();

        this.balanceService.resetTransactions();
    }

    ngOnInit(): void {
        this.balanceService.loadTransactions(this.numDays);

        // this.translatedDaysInterval = []
        // Object.values(DayInterval).forEach((value: string) => {
        //     this.translate.stream(value).subscribe((val: string) => {
        //         this.translatedDaysInterval.push(val)
        //     });
        // });

    }

    get daysIntervalValues(): string[] {
        return Object.values(this.DayInterval);
    }

    updateTransactions(): void {
        this.balanceService.resetTransactions();
        this.balanceService.loadTransactions(this.numDays, this.dateRange.dateFrom?.format("YYYY-MM-DD"), this.dateRange.dateTo?.format("YYYY-MM-DD"));
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

