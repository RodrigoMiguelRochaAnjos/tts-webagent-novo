import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, Type, createComponent } from "@angular/core";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";
import { DestroyService } from "./destroy.service";
import { Loading } from "src/app/shared/ui/loading/loading.model";
import { LoadingType } from "src/app/shared/ui/loading/loading-type.enum";
import { DefaultLoadingComponent } from "src/app/shared/ui/loading/types/default-loading/default-loading.component";
import { UUID } from "../utils/uuid.type";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    public loading$: BehaviorSubject<{ id: UUID, component: ComponentRef<Loading>, loadingType: LoadingType, response: BehaviorSubject<boolean> }[]> = new BehaviorSubject<{ id: UUID, component: ComponentRef<Loading>, loadingType: LoadingType, response: BehaviorSubject<boolean> }[]>([]);

    constructor(
        private environmentInjector: EnvironmentInjector,
        private appRef: ApplicationRef
    ) {}

    getLoadingStatus(id: UUID): Observable<boolean> | undefined {
        return this.findLoadingById(id)?.response;
    }

    
    load(type: LoadingType = LoadingType.DEFAULT): void {
            this.createLoadingComponent(type);
    }
    
    dismiss(): void {
        for(let loading of this.loading$.value) {
            document.getElementById(loading.id.toString())?.remove();
            loading.response.next(false);
        }
        
    }
    
    private findLoadingById(id: UUID): { id: UUID, component: ComponentRef<Loading>, loadingType: LoadingType, response: BehaviorSubject<boolean> } | undefined {
        return this.loading$.value.filter((value: { id: UUID, component: ComponentRef<Loading>, loadingType: LoadingType, response: BehaviorSubject<boolean> }) => value.id.toString() === id.toString())[0];
    }

    private findLoadingByType(type: LoadingType): { id: UUID, component: ComponentRef<Loading>, loadingType: LoadingType, response: BehaviorSubject<boolean> } | undefined {
        return this.loading$.value.filter((value: { id: UUID, component: ComponentRef<Loading>, loadingType: LoadingType, response: BehaviorSubject<boolean> }) => value.loadingType === type)[0];
    }

    private getTypeForEnum(type: LoadingType): Type<Loading> {
        switch (type) {
            case LoadingType.DEFAULT:
                return DefaultLoadingComponent;
            default:
                return DefaultLoadingComponent;
        }
    }


    private createLoadingComponent(type: LoadingType): UUID {
        const componentRef: ComponentRef<Loading> = createComponent(this.getTypeForEnum(type), { environmentInjector: this.environmentInjector });

        const uniqueId: UUID = new UUID();

        componentRef.instance.id = uniqueId;

        componentRef.location.nativeElement.id = uniqueId.toString();

        this.appRef.attachView(componentRef.hostView);
        document.body.appendChild(componentRef.location.nativeElement)

        this.loading$.next(this.loading$.value.concat({
            id: uniqueId,
            component: componentRef,
            loadingType: type,
            response: new BehaviorSubject(true)
        }));


        componentRef.onDestroy(() => {
            this.appRef.detachView(componentRef.hostView);
            document.getElementById(uniqueId.toString())?.remove();
        });

        return uniqueId;
    }
}