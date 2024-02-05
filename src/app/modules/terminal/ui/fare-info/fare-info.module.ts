import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FareInfoPage } from './fare-info.page';
import { NewLinePipe } from '../../pipes/new-line.pipe';
import { FareServiceChargeablePipe } from '../../pipes/fare-service-chargeable.pipe';
@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [FareInfoPage],
  declarations: [FareInfoPage, NewLinePipe, FareServiceChargeablePipe],
})
export class FareInfoPageModule {}
