import { Injectable } from "@angular/core";
import { AuthService } from "../authentication/auth.service";
import { Settings } from "src/app/modules/home/models/settings.model";
import { User } from "../models/user/user.model";
import { environment } from "src/environments/environment";
import { TranslateService } from "@ngx-translate/core";
import { takeUntil } from "rxjs";
import { DestroyService } from "./destroy.service";
import { AnonymousUser } from "../models/user/types/anonymous-user.model";
import { AuthenticatedUser } from "../models/user/types/authenticated-user.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private readonly ENDPOINT: string = environment.endpoints.TMA;
    private currentSettings: Settings = new Settings();

    private messages: { [key: string]: string } = {
        ERROR: '',
        DELETE: '',
        INVALID_FIELDS_MESSAGE: '',
        DELETE_ITEM_MESSAGE: '',
        LOGOUT: '',
    }

    constructor(
        private authService: AuthService,
        private httpClient: HttpClient,
        private destroyService: DestroyService,
        translate: TranslateService,
    ) {
        this.authService.getUser().subscribe((user: User) => this.currentSettings = user.settings);

        Object.keys(this.messages).forEach((key: string) => {
            translate.stream(key).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((text: string) => this.messages[key] = text);
        });
    }

    public save(newSettings: Settings): void {
        this.authService.updateUserSettings(newSettings);
    }

    update(newSettings: Settings, showLoading: boolean): void {
        this.authService.getUser().subscribe((user: User) => {
            if(!(user instanceof AuthenticatedUser || user instanceof AnonymousUser)) return;

            if (!newSettings.isValid()) {
                // this.alertService.show(
                //     this.errorLabel,
                //     this.invalidSettingsMessage
                // );

                return;
            }

            newSettings.lastUpdate = new Date().getTime();
            newSettings.profileUserName = newSettings.profileUserName.trim();
            newSettings.profileUserEmail = newSettings.profileUserEmail.trim();
            newSettings.profileUserPhone = newSettings.profileUserPhone.trim();
            const postData = {
                sessionId: user.id,
                settings: newSettings,
            };
            
            this.httpClient.post(`${this.ENDPOINT}/UpdateSettings`, postData).subscribe({
                next: (result: any) => {
                    this.save(newSettings);
                    // this.alertService.show(
                    //     this.errorLabel,
                    //     result.message
                    // );
                },
            });

        });
    }
}