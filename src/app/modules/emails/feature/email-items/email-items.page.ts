import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DestroyService } from 'src/app/core/services/destroy.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { Email } from '../../models/email.model';
import { EmailTemplate } from '../../models/email-template.model';
import { EmailsService } from '../../data-access/emails.service';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';

@Component({
    selector: 'app-email-items',
    templateUrl: './email-items.page.html',
    styleUrls: ['./email-items.page.scss'],
})
export class EmailItemsPage implements OnInit {
    selectedTemplateIndex!: number;
    emailTemplates!: EmailTemplate[];

    emailItems!: any[];
    itemsShowingMoreInfo!: boolean[];

    emailType: 'short' | 'long' = 'short';
    emailSubject = '';
    emailTo = '';
    isEmailPreview!: boolean;
    @Output() exitEmailItems = new EventEmitter<void>();

    private messages: {[key: string]: string} = {
        'ERROR': '',
        'DELETE': '',
        'DELETE_ITEM_MESSAGE': '',
        'DELETE_ALL_MESSAGE': '',
        'INVALID_FIELDS_MESSAGE': '',
    }

    InputType = InputType;

    constructor(
        private emailsService: EmailsService,
        private alertService: AlertService,
        private authService: AuthService,
        private translate: TranslateService,
        private destroyService: DestroyService
    ) {

        Object.keys(this.messages).forEach((key: string) => {
            translate.stream(key).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((text: string) => this.messages[key] = text);
        });
    }

    ngOnInit(): void {
        // this.statsService.addClientStat(clientStatisticsSources.sendByEmailNewMessage);
        this.emailsService.deselectAllEmailItemsFromTerminal();

        const user: User = this.authService.getUserValue()

        if (user.settings.sendByEmailItems.length > 0) {
            this.emailItems = user.settings.sendByEmailItems;
            this.itemsShowingMoreInfo = new Array(user.settings.sendByEmailItems.length);
            this.emailTemplates = user.settings.emailTemplates;
        } else
            this.onCloseClick();
    }

    onCloseClick(): void {
        this.exitEmailItems.emit();
    }

    clearEmailItems(): void {
        this.alertService.show(AlertType.CONFIRMATION, this.messages['DELETE_ALL_MESSAGE']).subscribe((action: AlertAction) => {
            if(action !== AlertAction.EXECUTE) return;

            this.emailsService.clearEmailItems();
        });
    }

    reorder(event: any): void {
        event.detail.complete();
        this.itemsShowingMoreInfo = new Array(this.emailItems.length);
        const indexFrom = event.detail.from > this.emailItems.length - 1 ? this.emailItems.length - 1 : event.detail.from;
        const indexTo = event.detail.to > this.emailItems.length - 1 ? this.emailItems.length - 1 : event.detail.to;
        this.emailsService.reorderEmailItems(indexFrom, indexTo);
    }

    deleteEmailItem(index: number): void {
        this.alertService.show(AlertType.CONFIRMATION, this.messages['DELETE_ITEM_MESSAGE']).subscribe((action: AlertAction) => {
            if(action !== AlertAction.EXECUTE) return;

            this.emailsService.removeItemFromEmail(index);
        });
    }

    toggleMoreInfo(index: number): void {
        this.itemsShowingMoreInfo[index] = this.itemsShowingMoreInfo[index] == null ? true : !this.itemsShowingMoreInfo[index];
    }

    getLineType(index: number): string {
        return this.itemsShowingMoreInfo[index] ? 'none' : 'full';
    }

    getDetailIcon(index: number): string {
        return this.itemsShowingMoreInfo[index] ? 'chevron-up' : 'chevron-down';
    }

    updateSubject(): void {
        this.emailSubject = this.emailTemplates[this.selectedTemplateIndex].subject;
    }

    previewEmail(): void {
        const emailTemplate = this.selectedTemplateIndex ? this.emailTemplates[this.selectedTemplateIndex] : null;
        if (emailTemplate != null) {
            // this.statsService.addClientStat(clientStatisticsSources.sendByEmailTemplate);
        }
        const emailData = new Email(
            this.emailSubject,
            this.emailTo,
            this.emailItems,
            this.emailType,
            emailTemplate ? emailTemplate.header : '',
            emailTemplate ? emailTemplate.footer : ''
        );
        if (emailData.isValid) {
            this.authService.updateUserEmailData(emailData);
            this.openCloseEmailPreview();
        } else {
            this.alertService.show(AlertType.ERROR, this.messages['INVALID_FIELDS_MESSAGE'])
        }
    }

    closeEmailPreview(): void {
        this.openCloseEmailPreview();
    }

    private openCloseEmailPreview(): void {
        this.isEmailPreview = !this.isEmailPreview;
    }


}
