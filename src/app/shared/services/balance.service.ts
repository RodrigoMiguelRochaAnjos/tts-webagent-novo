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

@Injectable({
    providedIn: 'root'
})
export class BalanceService {
    private readonly ENDPOINT: string = environment.endpoints.CURRENT_ACCOUNT;

    private balance$: BehaviorSubject<Balance> = new BehaviorSubject(new Balance(0, 'USD'));

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) {}

    public getBalance(): Observable<Balance> {
        return this.balance$;
    }

    public fetchAccountBalance(): void { 
        this.authService.getUser().subscribe((user: User) => {
            if(!(user instanceof AuthenticatedUser)) return;

            const headers: HttpHeaders = new HttpHeaders({
                Authorization: `Bearer ${user.token}`
            });

            this.httpClient.get<Balance>(`${this.ENDPOINT}/account/balance`, { headers: headers }).subscribe({
                next: (balance: Balance) => {
                    console.log(balance);
                    this.balance$.next(balance);
                },
                error: (error: Error) => {
                    console.log("Error fetching balance: ", error);
                }
            })
        });
    }
}