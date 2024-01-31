import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyBookingsPageComponent } from '../my-bookings-page/my-bookings-page.component';
import { MyBookingsPageModule } from '../my-bookings-page/module/my-bookings.module';

const routes: Routes = [
  {
      path: '',
      component: MyBookingsPageComponent,
      loadChildren: () => MyBookingsPageModule,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyBookingsShellRoutingModule {}
