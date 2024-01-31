import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BookingInfoComponent } from "../booking-info-page/booking-info.component";

const routes: Routes = [
    {
        path: '',
        component: BookingInfoComponent,
        loadChildren: () => import('../booking-info-page/module/booking-info.module').then((m) => m.BookingInfoModule)
    },
    {
        path: ':id',
        component: BookingInfoComponent,
        loadChildren: () => import('../booking-info-page/module/booking-info.module').then((m) => m.BookingInfoModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookingInfoShellRoutingModule {}