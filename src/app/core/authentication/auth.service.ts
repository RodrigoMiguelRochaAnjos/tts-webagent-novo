import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subscription, catchError, map } from "rxjs";
import { User } from "../models/user/user.model";
import { AnonymousUser } from "../models/user/types/anonymous-user.model";
import { UserService } from "./user/user.service";
import { AuthenticatedUser } from "../models/user/types/authenticated-user.model";
import { LoginRequest } from "../models/requests/login-request.model";
import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Router } from "@angular/router";
import { KeepAliveService } from "./keep-alive.service";
import { AuthValidationService, Validators } from "./auth-validation/auth-validation.service";
import { Settings } from "src/app/modules/home/models/settings.model";
import { IncompleteUser } from "../models/user/types/incomplete-user.model";
import { UserMapper } from "./user.mapper";

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy{
    private user$: BehaviorSubject<User> = new BehaviorSubject<User>(new AnonymousUser());

    private keepAliveSubscription!: Subscription;

    constructor(
        private userService: UserService,
        private loginValidator: AuthValidationService,
        private router: Router,
        private keepAliveService: KeepAliveService,
    ) {
        if(this.keepAliveSubscription != null) return;

        this.keepAliveSubscription = this.keepAliveService.getSessionStatus().subscribe({
            next: (valid: boolean) => {
                if (valid === false) {
                    this.reset();
                }
            }
        });
    }
    ngOnDestroy(): void {
        if(this.keepAliveSubscription == null) return;

        this.keepAliveSubscription.unsubscribe();
    }

    public getUser() : Observable<User> {
        return this.user$;
    }

    public getUserValue(): User {
        return this.user$.value;
    }

    login(loginRequest: LoginRequest): void{
        this.userService.login(loginRequest).subscribe({
            next: (response: LoginResponse) => {

                Object.setPrototypeOf(response.syncData.settings, Settings.prototype)

                switch (this.loginValidator.validateLogin(response)){
                    case Validators.VALID:
                        this.processLogin((UserMapper.mapLoginToUser(loginRequest, response) as AuthenticatedUser));
                        break;
                    case Validators.INVALID_LICENSE:
                        alert("INVALID LICENSE");
                        break;
                    case Validators.INVALID_SETTINGS:
                        alert("INVALID SETTINGS");

                        response.syncData.settings = Settings.default();

                        this.processLogin((UserMapper.mapLoginToUser(loginRequest, response) as IncompleteUser));
                        break;
                    case Validators.HAS_ALERT:
                        alert("HAS ALERTS");
                        break;
                }
                
                
            },
            error: (err: any) => {
                console.log(err)
            }
        })
    }


    private processLogin(user: AuthenticatedUser | IncompleteUser): void {
        this.user$.next(user);

        user.save();

        this.keepAliveService.start(user.id);

        this.router.navigate(['dashboard']);
    }

    logout(): void {
        if (this.user$.getValue() instanceof AnonymousUser) {
            return;
        }

        const postData = {
            sessionId: (this.user$.getValue() as AuthenticatedUser).id,
            user: (this.user$.getValue() as AuthenticatedUser).gds.son,
        };

        this.userService.logout(postData).subscribe({
            next: (result) => {
                this.reset();
            },
            error: (err: Error) => {
                this.reset()
            }
        });
    }

    private reset(): void {
        this.user$.next(new AnonymousUser());
        this.user$.getValue().save();
        
        this.keepAliveService.stop();

        this.router.navigate(['home']);
    }

    public loadUserFromStorage(): void {
        const storageItem: string | null = localStorage.getItem("user");
        
        let user: User = UserMapper.mapStorageToUser(storageItem);

        if (!(user instanceof AuthenticatedUser)) {
            this.user$.next(user);
            return;
        }
        this.keepAliveService.checkSession(user.id).subscribe(
            (response) => {
                if (!response.status || !(user instanceof AuthenticatedUser)) {
                    this.reset();
                    return;
                }

                this.keepAliveService.start(user.id);

                this.user$.next(user)
            }
        )
    }
}