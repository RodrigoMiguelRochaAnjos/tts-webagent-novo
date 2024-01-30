import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";
import { DestroyService } from "../services/destroy.service";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    public show$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private destroyService: DestroyService
    ) {}

    getLoadingStatus(): Observable<boolean> {
        return this.show$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    show(): void {
        this.show$.next(true)

    }

    dismiss(): void {
        this.show$.next(false);

    }
}