import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TerminalPageRoutingModule } from './terminal-routing.module';

import { TerminalPage } from './terminal.page';
import { TerminalComponent } from './terminal/terminal.component';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { RightMenuComponent } from './right-menu/right-menu.component';

@NgModule({
    declarations: [
        TerminalPage,
        TerminalComponent,
        BottomBarComponent,
        RightMenuComponent,
        CalendarPickerComponent
    ],
    providers: [
        TerminalService,
        MenuService
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TerminalPageRoutingModule,
        HeaderModule,
        FiltersPageModule,
        BrandsAndAncillariesPageModule,
        EmailItemsPageModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatCardModule,
        TranslateModule.forChild(),
    ]
})
export class TerminalPageModule { }
