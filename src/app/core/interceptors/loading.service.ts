import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    public show$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {}

    getLoadingStatus(): Observable<boolean> {
        return this.show$;
    }

    show(): void {
        this.show$.next(true)

    }

    dismiss(): void {
        this.show$.next(false);

    }
}