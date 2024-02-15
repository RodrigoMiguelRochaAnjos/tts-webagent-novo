import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { UserService } from 'src/app/core/authentication/user/user.service';
import { User } from 'src/app/core/models/user/user.model';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { CircularLinkedList } from 'src/app/core/utils/circular-linked-list.structure';
import { DoublyLinkedList } from 'src/app/core/utils/doubly-linked-list.structure';
import { CheckoutService } from 'src/app/modules/neo/data-access/checkout.service';
import { ReservationService } from 'src/app/modules/neo/data-access/reservation/reservation.service';
import { AirCheckoutDetailsResponse } from 'src/app/modules/neo/features/search/models/air-checkout-details-response.model';
import { AirSearchResponse } from 'src/app/modules/neo/models/responses/air-search-result/air-search-result-response.model';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit{

    InputType = InputType;

    constructor(
        
    ) {
    }

    ngOnInit(): void {
    }

    logEvent(event: {min: number, max: number}) {
        console.log(event);
    }
}
