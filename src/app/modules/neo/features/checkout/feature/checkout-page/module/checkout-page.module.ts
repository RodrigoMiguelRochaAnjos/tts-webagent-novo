import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CheckoutPageComponent } from '../checkout-page.component';



@NgModule({
    declarations: [CheckoutPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule
    ],
    exports: [CheckoutPageComponent]
})
export class CheckoutPageModule { }
