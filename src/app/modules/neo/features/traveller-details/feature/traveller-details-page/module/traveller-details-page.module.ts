import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravellerDetailsPageComponent } from '../traveller-details-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [TravellerDetailsPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule
    ],
    exports: [TravellerDetailsPageComponent]
})
export class TravellerDetailsPageModule { }
