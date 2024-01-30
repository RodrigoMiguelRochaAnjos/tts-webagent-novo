import { Component, ComponentRef, HostBinding } from '@angular/core';
import { Alert } from '../../alert.interface';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { BehaviorSubject } from 'rxjs';
import { UUID } from 'src/app/core/utils/uuid.type';

@Component({
  selector: 'app-warning-alert',
  templateUrl: './warning-alert.component.html',
  styleUrls: ['./warning-alert.component.scss']
})
export class WarningAlertComponent extends Alert{
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
        console.log("reached");
        this.alertService.close(this.alertId!, action);
    }
}
