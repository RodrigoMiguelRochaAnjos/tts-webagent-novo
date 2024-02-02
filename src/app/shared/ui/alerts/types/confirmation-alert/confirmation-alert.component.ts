import { Component, ComponentRef, HostBinding } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { UUID } from 'src/app/core/utils/uuid.type';
import { Alert } from '../../alert.model';

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss']
})
export class ConfirmationAlertComponent extends Alert{
    AlertAction = AlertAction;

    constructor(
        private alertService: AlertService
    ) {
        super();
    }

    @HostBinding("class.hide")
    get hide(): boolean {
        const alert: { id: UUID, component: ComponentRef<Alert>, show: boolean, response: BehaviorSubject<AlertAction> } | undefined = this.alertService.getResponseById(this.alertId!)

        if (alert == null) return false;

        return !alert.show;
    }

    close(action: AlertAction): void {
        this.alertService.close(this.alertId!, action);
    }
}
