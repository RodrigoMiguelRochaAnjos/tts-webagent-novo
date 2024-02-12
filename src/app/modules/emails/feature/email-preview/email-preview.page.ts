import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Email } from '../../models/email.model';
import { EmailsService } from '../../data-access/emails.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
	selector: 'app-email-preview',
	templateUrl: './email-preview.page.html',
	styleUrls: ['./email-preview.page.scss'],
})
export class EmailPreviewPage implements OnInit {
	emailData?: Email;
	emailContent!: SafeHtml;
	@Output() closeEmailPreview = new EventEmitter<string>();

	constructor(
		private emailsService: EmailsService,
		private domSanitizer: DomSanitizer,
        private authService: AuthService
	) {}

	ngOnInit() {
		// this.statsService.addClientStat(clientStatisticsSources.emailTemplatePreview);
        this.emailData = this.authService.getUserValue().emailData;

        if(!this.emailData) return;

		this.emailContent = this.domSanitizer.bypassSecurityTrustHtml(this.emailData.getEmailHtmlContent());
	}

	sendEmail(): void {
		// this.statsService.addClientStat(clientStatisticsSources.emailTemplateSend);
		this.emailsService.sendEmail(this.emailData);
	}

	onCloseClick(): void {
		this.closeEmailPreview.emit();
	}

}
