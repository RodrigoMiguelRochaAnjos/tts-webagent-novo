import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FareQuotePage } from './fare-quote.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  exports:[FareQuotePage],
  declarations: [FareQuotePage]
})
export class FareQuotePageModule {}
