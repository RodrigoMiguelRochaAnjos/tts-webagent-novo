import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrandsAndAncillariesPage } from './brands-and-ancillaries.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FareInfoPageModule } from '../fare-info/fare-info.module';
import { FareQuotePageModule } from '../fare-quote/fare-quote.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FareInfoPageModule,
        FareQuotePageModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
    ],
    exports: [BrandsAndAncillariesPage],
    declarations: [BrandsAndAncillariesPage],
})
export class BrandsAndAncillariesPageModule { }
