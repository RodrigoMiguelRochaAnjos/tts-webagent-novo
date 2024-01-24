import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravellerDetailsShellRoutingModule } from './traveller-details-shell-routing.module';



@NgModule({
  imports: [TravellerDetailsShellRoutingModule],
  exports: [TravellerDetailsShellRoutingModule]
})
export class TravellerDetailsShellModule {}
