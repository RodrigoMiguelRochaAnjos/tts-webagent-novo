import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, Type, createComponent } from "@angular/core";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";
import { AlertType } from "src/app/shared/ui/alerts/alert-type.enum";
import { Alert } from "src/app/shared/ui/alerts/alert.model";
import { ErrorAlertComponent } from "src/app/shared/ui/alerts/types/error-alert/error-alert.component";
import { WarningAlertComponent } from "src/app/shared/ui/alerts/types/warning-alert/warning-alert.component";
import { UUID } from "../utils/uuid.type";
import { DestroyService } from "./destroy.service";
import { SuccessAlertComponent } from "src/app/shared/ui/alerts/types/success-alert/success-alert.component";
import { ConfirmationAlertComponent } from "src/app/shared/ui/alerts/types/confirmation-alert/confirmation-alert.component";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private alerts$: BehaviorSubject<{ id: UUID, component: ComponentRef<Alert>, show: boolean, response: BehaviorSubject<AlertAction> }[]> = new BehaviorSubject<{ id: UUID, component: ComponentRef<Alert>, show: boolean, response: BehaviorSubject<AlertAction>}[]>([]);

    constructor(
        private environmentInjector: EnvironmentInjector,
        private appRef: ApplicationRef,
        private destroyService: DestroyService
    ) { }

    show(type: AlertType, content: any): Observable<AlertAction> {
        const id = this.createAlertComponent(type, content);
        const alert: { id: UUID, component: ComponentRef<Alert>, show: boolean, response: BehaviorSubject<AlertAction> } | undefined = this.getResponseById(id);

        if(alert == null) throw new Error("Alert creation error");

        return alert.response.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    close(id: UUID, action: AlertAction): void {
        this.alerts$.next(
            this.alerts$.value.map((value: { id: UUID, component: ComponentRef<Alert>, show: boolean, response: BehaviorSubject<AlertAction> }) => {
                if(id.toString() !== value.id.toString()) return value;

                value.show = false;
                value.response.next(action);

                return value;
            })
        );
    }

    public getResponseById(id: UUID): { id: UUID, component: ComponentRef<Alert>, show: boolean, response: BehaviorSubject<AlertAction> } | undefined {
        return this.alerts$.value
            .filter((value: { id: UUID, component: ComponentRef<Alert>, show: boolean, response: BehaviorSubject<AlertAction> }) => value.id.toString() === id.toString())[0];
    }

    private getTypeForEnum(type: AlertType): Type<Alert> {
        switch (type) {
            case AlertType.ERROR:
                return ErrorAlertComponent;
            case AlertType.WARNING:
                return WarningAlertComponent;
            case AlertType.SUCCESS:
                return SuccessAlertComponent;
            case AlertType.CONFIRMATION:
                return ConfirmationAlertComponent;
        }
    }

    private createAlertComponent(type: AlertType, content: any): UUID {
        const componentRef: ComponentRef<Alert> = createComponent(this.getTypeForEnum(type), { environmentInjector: this.environmentInjector });

        const uniqueId: UUID = new UUID();

        componentRef.instance.alertId = uniqueId
        componentRef.instance.content = content;

        componentRef.location.nativeElement.id = uniqueId.toString();

        document.body.appendChild(componentRef.location.nativeElement);

        this.alerts$.next(this.alerts$.value.concat({
            id: uniqueId,
            component: componentRef,
            show: true,
            response: new BehaviorSubject(AlertAction.WAITING)
        }));

        this.appRef.attachView(componentRef.hostView);

        componentRef.onDestroy(() => {
            this.appRef.detachView(componentRef.hostView);
            document.getElementById(uniqueId.toString())?.remove();
        });

        return uniqueId;
    }
}

export enum AlertAction {
    EXECUTE,
    CANCEL,
    WAITING
}