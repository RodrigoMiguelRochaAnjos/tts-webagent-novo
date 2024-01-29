import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TerminalPage } from '../terminal.page';
import { TerminalComponent } from '../../../ui/terminal/terminal.component';
import { BottomBarComponent } from '../../../ui/bottom-bar/bottom-bar.component';
import { RightMenuComponent } from '../../../ui/right-menu/right-menu.component';
import { TerminalService } from '../../../data-access/terminal.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuService } from '../../../data-access/menu.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        TerminalPage,
        TerminalComponent,
        BottomBarComponent,
        RightMenuComponent,
        // CalendarPickerComponent
    ],
    providers: [
        TerminalService,
        MenuService
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        // IonicModule,
        // HeaderModule,
        // FiltersPageModule,
        // BrandsAndAncillariesPageModule,
        // EmailItemsPageModule,
        // MatDatepickerModule,
        // MatFormFieldModule,
        // MatInputModule,
        // MatNativeDateModule,
        // MatCardModule,
        // TranslateModule.forChild(),
    ]
})
export class TerminalPageModule { }
