import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { environment } from "src/environments/environment";
import { Balance } from "../models/balance.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserService } from "src/app/core/authentication/user/user.service";
import { AuthService } from "src/app/core/authentication/auth.service";
import { User } from "src/app/core/models/user/user.model";
import { AuthenticatedUser } from "src/app/core/models/user/types/authenticated-user.model";
import { AnonymousUser } from "src/app/core/models/user/types/anonymous-user.model";
import { IncompleteUser } from "src/app/core/models/user/types/incomplete-user.model";
import { PageableWrapper } from "src/app/core/models/pageable-wrapper.model";
import { Transaction, Transactions } from "../models/transaction.model";

@Injectable({
    providedIn: 'root'
})
export class BalanceService {
    private readonly ENDPOINT: string = environment.endpoints.CURRENT_ACCOUNT;

    public page: number = 0;
    public size: number = 5;

    private balance$: BehaviorSubject<Balance> = new BehaviorSubject(new Balance(0, 'USD'));
    private transactions$: BehaviorSubject<Transactions> = new BehaviorSubject<Transactions>([]);

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) {}

    public getBalance(): Observable<Balance> {
        return this.balance$;
    }

    public getBalanceValue(): Balance {
        return this.balance$.value;
    }

    public getTransactions(): Observable<Transactions> {
        return this.transactions$;
    }

    public getTransactionsValue(): Transactions {
        return this.transactions$.value;
    }

    public fetchAccountBalance(): void { 
        this.authService.getUser().subscribe((user: User) => {
            if(!(user instanceof AuthenticatedUser)) return;

            const headers: HttpHeaders = new HttpHeaders({
                Authorization: `Bearer ${user.token}`
            });

            this.httpClient.get<Balance>(`${this.ENDPOINT}/account/balance`, { headers: headers }).subscribe({
                next: (balance: Balance) => {
                    this.balance$.next(balance);
                },
                error: (error: Error) => {
                    console.log("Error fetching balance: ", error);
                }
            })
        });
    }

    loadTransactions(numberOfDays: number) {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            const headers: HttpHeaders = new HttpHeaders({
                Authorization: `Bearer ${user.token}`
            });

            let remoteUrl: string = `${this.ENDPOINT}/account/transactions?page=${this.page}&size=${this.size}`;

            if (numberOfDays != null) remoteUrl += `&limit=${numberOfDays}`;

            this.httpClient.get<PageableWrapper<Transactions>>(remoteUrl, { headers: headers }).subscribe({
                next: (data: PageableWrapper<Transactions>) => {

                    this.transactions$.next(this.transactions$.value.concat(data.content));
                    this.page++;
                },
                error: (error) => {
                    console.error('An error occurred:', error);
                }
            });
        });
    }
}

