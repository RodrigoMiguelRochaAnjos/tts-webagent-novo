import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyBookingsPageComponent } from '../my-bookings-page.component';
import { BookingModule } from "../../../ui/booking/module/booking.module";



@NgModule({
    declarations: [MyBookingsPageComponent],
    exports: [MyBookingsPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        BookingModule
    ]
})
export class MyBookingsPageModule { }
