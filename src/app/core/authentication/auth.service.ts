import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subscription, catchError, map, takeUntil } from "rxjs";
import { User } from "../models/user/user.model";
import { AnonymousUser } from "../models/user/types/anonymous-user.model";
import { UserService } from "./user/user.service";
import { AuthenticatedUser } from "../models/user/types/authenticated-user.model";
import { LoginRequest } from "../models/requests/login-request.model";
import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Router } from "@angular/router";
import { KeepAliveService } from "./keep-alive.service";
import { AuthValidationService, AuthValidators } from "./auth-validation/auth-validation.service";
import { Settings } from "src/app/modules/home/models/settings.model";
import { IncompleteUser } from "../models/user/types/incomplete-user.model";
import { UserMapper } from "./user.mapper";
import { SyncData } from "src/app/modules/home/models/sync-data.model";
import { DestroyService } from "../services/destroy.service";
import { PkeysService } from "src/app/modules/terminal/data-access/pkeys.service";
import { AlertService } from "../services/alert.service";
import { AlertType } from "src/app/shared/ui/alerts/alert-type.enum";
import { TranslateService } from "@ngx-translate/core";
import { deepClone } from "../utils/deep-clone.tool";
import { Contact } from "../models/user/contact/contact.model";
import { Email } from "src/app/modules/emails/models/email.model";
import { SyncDataSettings } from "src/app/modules/terminal/models/sync-data-settings.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {
    private user$: BehaviorSubject<User> = new BehaviorSubject<User>(new AnonymousUser());

    private keepAliveSubscription!: Subscription;

    private messages: {[key: string]: string} = {
        INVALID_LICENSE: '',
        INVALID_SETTINGS: '',
        ERROR: '',
        DELETE: '',
        INVALID_FIELDS_MESSAGE: '',
        DELETE_ITEM_MESSAGE: '',
        LOGOUT: '',
    }

    constructor(
        private userService: UserService,
        private loginValidator: AuthValidationService,
        private router: Router,
        private keepAliveService: KeepAliveService,
        private destroyService: DestroyService,
        private alertService: AlertService,
        private userMapper: UserMapper,
        translate: TranslateService
    ) {

        Object.keys(this.messages).forEach((key: string) => {
            translate.stream(key).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((text: string) => this.messages[key] = text);
        });

        if (this.keepAliveSubscription != null) return;

        this.keepAliveSubscription = this.keepAliveService.getSessionStatus().subscribe({
            next: (valid: boolean) => {
                if (valid === false) {
                    this.reset();
                }
            }
        });
    }
    ngOnDestroy(): void {
        if (this.keepAliveSubscription == null) return;

        this.keepAliveSubscription.unsubscribe();
    }

    public getUser(): Observable<User> {
        return this.user$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public getUserValue(): User {
        return this.user$.value;
    }

    login(loginRequest: LoginRequest): void {
        this.userService.login(loginRequest)
            .pipe(takeUntil(this.destroyService.getDestroyOrder()))
            .subscribe({
                next: (response: LoginResponse) => {

                    if (response.syncData) {
                        Object.setPrototypeOf(response.syncData, SyncData.prototype)
                        Object.setPrototypeOf(response.syncData.settings, SyncDataSettings.prototype)
                    }

                    switch (this.loginValidator.validateLogin(response)) {
                        case AuthValidators.VALID:
                            this.processLogin((this.userMapper.mapLoginToUser(loginRequest, response) as AuthenticatedUser));
                            break;
                        case AuthValidators.INVALID_LICENSE:
                            this.alertService.show(AlertType.ERROR, this.messages['INVALID_LICENSE'])
                            break;
                        case AuthValidators.NO_SETTINGS:
                            this.alertService.show(AlertType.ERROR, this.messages['INVALID_SETTINGS']);

                            response.syncData.settings = SyncDataSettings.default();
                            break;
                        case AuthValidators.INVALID_SETTINGS:
                            this.alertService.show(AlertType.ERROR, this.messages['INVALID_SETTINGS']);

                            this.processLogin((this.userMapper.mapLoginToUser(loginRequest, response) as IncompleteUser));
                            break;
                        case AuthValidators.HAS_ALERT:
                            this.alertService.show(AlertType.ERROR, 'HAS ALERTS');
                            break;
                        case AuthValidators.INVALID_REQUEST:
                            this.alertService.show(AlertType.ERROR, 'INVALID_LOGIN');
                            break;
                    }


                },
                error: (err: any) => {
                }
            })
    }


    private processLogin(user: AuthenticatedUser | IncompleteUser): void {
        this.user$.next(user);

        user.save();

        this.keepAliveService.start(user.id);

        this.router.navigate(['neo']);
    }

    logout(): void {
        if (this.user$.getValue() instanceof AnonymousUser) {
            return;
        }

        const postData = {
            sessionId: (this.user$.getValue() as AuthenticatedUser).id,
            user: (this.user$.getValue() as AuthenticatedUser).gds.son,
        };

        this.userService.logout(postData)
            .pipe(takeUntil(this.destroyService.getDestroyOrder()))
            .subscribe({
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

    updateUserSettings(newSettings: Settings): void {
        const user: User = this.user$.value;

        if (!(user instanceof AuthenticatedUser || user instanceof IncompleteUser)) return;

        if (!newSettings.isValid()) {
            this.alertService.show(AlertType.ERROR, this.messages['INVALID_SETTINGS']);

            return;
        }

        if(!newSettings.sendByEmailItems) newSettings.sendByEmailItems = [];
        newSettings.lastUpdate = new Date().getTime();
        newSettings.profileName = newSettings.profileName.trim();
        newSettings.profileEmail = newSettings.profileEmail.trim();
        newSettings.profilePhone = newSettings.profilePhone.trim();
        const postData: { sessionId: string, settings: any } = {
            sessionId: user.id,
            settings: newSettings.toPostData(),
        };

        this.userService.updateSettings(postData).subscribe({
            next: (result: { message: string}) => {
                if(result.message !== 'OK') return;

                let user: AuthenticatedUser = new AuthenticatedUser().copy(this.user$.value);
                
                user.settings = newSettings;

                user.save();

                this.user$.next(user);

                this.alertService.show(AlertType.SUCCESS, result.message);
            },
            error: (err) => {
                this.alertService.show(AlertType.ERROR, "Failed to save settings");
            }
        });

    }

    updateUserContact(contact: Contact): void {
        const user: User = this.user$.value;

        user.contact = contact;

        this.user$.next(user);
    }

    updateUserEmailData(email: Email) {
        const user: User = this.user$.value;

        user.emailData = email;

        this.user$.next(user);
    }
}