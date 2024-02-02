import { Component, ComponentRef, HostBinding } from '@angular/core';
import { Alert } from '../../alert.model';
import { AlertAction, AlertService } from 'src/app/core/services/alert.service';
import { BehaviorSubject } from 'rxjs';
import { UUID } from 'src/app/core/utils/uuid.type';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.scss']
})
export class ErrorAlertComponent extends Alert{
    AlertAction = AlertAction;

    constructor(
        private alertService: AlertService
    ) {
        super();
    }

    @HostBinding("class.hide")
    get hide(): boolean {
        const alert: { id: UUID, component: ComponentRef<Alert>, show: boolean, response: BehaviorSubject<AlertAction> } | undefined = this.alertService.getResponseById(this.alertId!)
        
        if(alert == null) return false;

        return !alert.show;
    }

    close(action: AlertAction): void{
        this.alertService.close(this.alertId!, action);
    }
}
