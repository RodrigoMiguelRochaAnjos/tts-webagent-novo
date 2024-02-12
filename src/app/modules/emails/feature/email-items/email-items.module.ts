import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { EmailItemsPage } from './email-items.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { DirectivesModule } from 'src/app/shared/directives/directive.module';
import { EmailsService } from '../../data-access/emails.service';
import { EmailPreviewPageModule } from '../email-preview/email-preview.module';
@NgModule({
    imports: [
        CommonModule,
        DirectivesModule,
        EmailPreviewPageModule,
        FormsModule,
        SharedModule
    ],
    exports: [EmailItemsPage],
    declarations: [EmailItemsPage],
    providers: [EmailsService],
})
export class EmailItemsPageModule { }
