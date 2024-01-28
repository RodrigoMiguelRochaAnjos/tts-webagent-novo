import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, Type, createComponent } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AlertType } from "src/app/shared/ui/alerts/alert-type.enum";
import { Alert } from "src/app/shared/ui/alerts/alert.interface";
import { ErrorAlertComponent } from "src/app/shared/ui/alerts/types/error-alert/error-alert.component";
import { WarningAlertComponent } from "src/app/shared/ui/alerts/types/warning-alert/warning-alert.component";

@Injectable({
    providedIn: 'root'
})
export class AlertService { 

    private alerts$: BehaviorSubject<{ id: string, component: Alert, show: boolean }[]> = new BehaviorSubject<{ id: string, component: Alert, show: boolean }[]>([]);
    private alertHistory: string[] = []

    constructor(
        private environmentInjector: EnvironmentInjector,
        private appRef: ApplicationRef,
    ) {}

    getTypeForEnum(type: AlertType): Type<Alert> {
        switch(type){
            case AlertType.ERROR:
                return ErrorAlertComponent;
            case AlertType.WARNING:
                return WarningAlertComponent;
        }
    }

    createAlertComponent(type: AlertType, content: any): void {
        const componentRef: ComponentRef<Alert> = createComponent(this.getTypeForEnum(type), { environmentInjector: this.environmentInjector });

        componentRef.instance.alertId = "this.modalId";
        componentRef.instance.content = "this.modalContent";

        const uniqueId = `modal-`; // this.modalId;
        componentRef.location.nativeElement.id = uniqueId;

        document.body.appendChild(componentRef.location.nativeElement);

        this.alertHistory.push(uniqueId);

        this.appRef.attachView(componentRef.hostView);

        componentRef.onDestroy(() => {
            this.appRef.detachView(componentRef.hostView);
            document.getElementById(uniqueId)?.remove();
        });
    }
}