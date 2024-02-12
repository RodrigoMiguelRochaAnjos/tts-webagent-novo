import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmailPreviewPage } from './email-preview.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmailsService } from '../../data-access/emails.service';

@NgModule({
	imports: [
        CommonModule,
        FormsModule,
		SharedModule
    ],
	exports: [EmailPreviewPage],
	declarations: [EmailPreviewPage],
})
export class EmailPreviewPageModule {}
