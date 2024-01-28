import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DestroyService implements OnDestroy{
    private destroy$: Subject<void> = new Subject<void>();
    
    public getDestroyOrder(): Observable<void> {
        return this.destroy$;
    }
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}