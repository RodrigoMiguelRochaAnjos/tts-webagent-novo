import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from '../booking.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [BookingComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[BookingComponent]
})
export class BookingModule { }
