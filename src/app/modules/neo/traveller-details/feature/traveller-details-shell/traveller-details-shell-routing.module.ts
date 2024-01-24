import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TravellerDetailsPageModule } from '../traveller-details-page/module/traveller-details-page.module';
import { TravellerDetailsPageComponent } from '../traveller-details-page/traveller-details-page.component';

const routes: Routes = [
  {
      path: '',
      component: TravellerDetailsPageComponent,
      loadChildren: () => TravellerDetailsPageModule
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravellerDetailsShellRoutingModule {}
