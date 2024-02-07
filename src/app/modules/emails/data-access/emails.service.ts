import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Email } from "../models/email.model";
import { AlertService } from "src/app/core/services/alert.service";
import { DestroyService } from "src/app/core/services/destroy.service";
import { takeUntil } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/core/authentication/auth.service";
import { deepClone } from "src/app/core/utils/deep-clone.tool";
import { pullAt } from "src/app/core/utils/pull-at.tool";
import { User } from "src/app/core/models/user/user.model";
import { AuthenticatedUser } from "src/app/core/models/user/types/authenticated-user.model";
import { AlertType } from "src/app/shared/ui/alerts/alert-type.enum";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class EmailsService {
    private readonly ENDPOINT: string = environment.endpoints.TMA;

    private messages: {[key: string]: string} = {
        'INVALID_EMAIL_MESSAGE': '',
        'ERROR': '',
        'SUCCESS': '',
        'EMAIL_SENT_MESSAGE': '',
    }

    constructor(
        private alertService: AlertService,
        private restService: HttpClient,
        private translate: TranslateService,
        private authService: AuthService,
        private destroyService: DestroyService
    ) {
        Object.keys(this.messages).forEach((key: string) => {
            translate.stream(key).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((text: string) => this.messages[key] = text);
        });
    }

    deselectAllEmailItemsFromTerminal(): void {
        const selectedElements = document.getElementById('terminal-page')?.getElementsByClassName('terminal-email-selected');
        [].slice.call(selectedElements).forEach((element) => {
            const selectedElement = element as HTMLElement;
            selectedElement.classList.remove('terminal-email-selected');
        });
    }

    clearEmailItems(): void {
        const settings = this.authService.getUserValue().settings;
        settings.clearSendByEmailItems();
        this.authService.updateUserSettings(settings);
    }

    reorderEmailItems(indexFrom: number, indexTo: number): void {
        // clone data in order to not lose the original data
        const settings = this.authService.getUserValue().settings;
        const item = deepClone(settings.sendByEmailItems[indexFrom]);
        pullAt(settings.sendByEmailItems, indexFrom);
        settings.sendByEmailItems.splice(indexTo, 0, item);
        this.authService.updateUserSettings(settings);
    }

    
    removeItemFromEmail(index: number): void {
        const settings = this.authService.getUserValue().settings;
        pullAt(settings.sendByEmailItems, index);
        this.authService.updateUserSettings(settings);
    }

    sendEmail(email?: Email): void {
        if(!email) {
            this.alertService.show(AlertType.ERROR, "Email is empty");
            return;
        }

        if (!email?.isValid) {
            this.alertService.show(AlertType.ERROR, this.messages['INVALID_EMAIL_MESSAGE']);
            return;
        }
        
        const user: User = this.authService.getUserValue();

        if(!(user instanceof AuthenticatedUser)) return;

        const postData = {
            sessionId: user.id,
            from: user.settings.profileEmail,
            fromName: user.name,
            to: email.toEmail,
            isHtml: true,
            subject: email.emailSubject,
            body: email.getEmailHtmlContent().replace(/"/g, "'"),
        };
        this.restService.post(`${this.ENDPOINT}/SendMail`, postData).subscribe({
            next: (result: any) => {
                const settings = user.settings;
                settings.clearSendByEmailItems();
                this.authService.updateUserSettings(settings);
                this.authService.updateUserEmailData(email);
                this.alertService.show(AlertType.SUCCESS, this.messages['SUCCESS']);
            },
            error: (err: Error) => {
                this.alertService.show(AlertType.ERROR, "Error sending email");
            }
        })
    }
}
