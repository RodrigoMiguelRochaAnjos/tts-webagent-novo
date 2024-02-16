import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "src/app/core/authentication/auth.service";
@Injectable({
    providedIn: 'root'
})
export class BetterFilterService implements OnInit{

    private priceFilter$: BehaviorSubject<PriceFilterSelection> = new BehaviorSubject<PriceFilterSelection>({
        max: 0,
        min: 0,
        currency: "EUR",
        selected: { min: 0, max: 0 }
    });
    private dateFilter$: BehaviorSubject<Map<DateType, DateFilterSelection>> = new BehaviorSubject<Map<DateType, DateFilterSelection>>(new Map<DateType, DateFilterSelection>());

    private checkboxFilter$: BehaviorSubject<Map<SelectionType, CheckboxFilterSelection[]>> = new BehaviorSubject<Map<SelectionType, CheckboxFilterSelection[]>>(new Map<SelectionType, CheckboxFilterSelection[]>());
    
    private intervalFilter$: BehaviorSubject<Map<IntervalType, IntervalFilterSelection>> = new BehaviorSubject<Map<IntervalType, IntervalFilterSelection>>(new Map<IntervalType, IntervalFilterSelection>());

    constructor(
        private authService: AuthService
    ) {  }

    ngOnInit(): void {
        this.reset();
    }

    get priceFilterSelection() : PriceFilterSelection {
        return this.priceFilter$.getValue();
    }
    get dateFilterSelection(): Map<DateType, DateFilterSelection> {
        return this.dateFilter$.getValue();
    }
    get checkboxFilterSelection(): Map<SelectionType, CheckboxFilterSelection[]> {
        return this.checkboxFilter$.getValue();
    }

    get intervalFilterSelection(): Map<IntervalType, IntervalFilterSelection> {
        return this.intervalFilter$.getValue();
    }

    get priceFilter() : Observable<PriceFilterSelection> {
        return this.priceFilter$;
    }

    get dateFilter(): Observable<Map<DateType, DateFilterSelection>> {
        return this.dateFilter$;
    }

    get intervalFilter(): Observable<Map<IntervalType, IntervalFilterSelection>> {
        return this.intervalFilter$;
    }

    get checkboxFilter(): Observable<Map<SelectionType, CheckboxFilterSelection[]>> {
        return this.checkboxFilter$;
    }

    get areOriginalFilters() : boolean {
        return (
            this.priceFilterSelection.selected.min === this.priceFilterSelection.min &&
            this.priceFilterSelection.selected.max === this.priceFilterSelection.max &&
            this.doesMapHaveDefaultArrayValues(this.checkboxFilterSelection) &&
            this.doesMapHaveDefaultValues(this.dateFilterSelection)
        )
    }

    private doesMapHaveDefaultValues(map1: Record<string, any>): boolean {
        const keys1 = Object.keys(map1);

        for (const key of keys1) {
            if (
                map1[key].selected.max !== map1[key].max ||
                map1[key].selected.min !== map1[key].min
            ) {
                return false;
            }
        }

        return true;
    }

    private doesMapHaveDefaultArrayValues(map1: Record<string, any>): boolean {
        const keys1 = Object.keys(map1);

        for (const key of keys1) {
            for(let element of map1[key]){
                if(!element.selected) false; 
            }
        }

        return true;
    }

    public updatePriceFilter(value : PriceFilterSelection) : void {
        this.priceFilter$.next(value);
    }

    public updateDateFilter(id: DateType, value: DateFilterSelection): void {
        this.dateFilter$.next(this.dateFilter$.getValue().set(id, value));
    }

    public updateCheckboxFilter(id: SelectionType, value: CheckboxFilterSelection[]): void {
        this.checkboxFilter$.next(this.checkboxFilter$.value.set(id, value));
    }

    public updateIntervalFilter(id: IntervalType, value: IntervalFilterSelection): void {
        this.intervalFilter$.next(this.intervalFilter$.value.set(id, value));
    }

    public reset() : void {
        this.priceFilter$.next({
            max: 0,
            min: 0,
            currency: this.authService.getUserValue().settings.currency,
            selected: { min: 0, max: 0 }
        });
        this.dateFilter$.next(new Map<DateType, DateFilterSelection>());
        this.checkboxFilter$.next(new Map<SelectionType, CheckboxFilterSelection[]>());
    }
}

export interface PriceFilterSelection {
    max: number;
    min: number;
    selected: { min: number, max: number };
    currency: string;
}

export interface DateFilterSelection {
    min: Date;
    max: Date;
    selected: { min: Date, max: Date };
}

export interface IntervalFilterSelection {
    min: number;
    max: number;
    selected: { min: number, max: number };
}

export interface CheckboxFilterSelection {
    value: string;
    label: string;
    selected: boolean;
}

export enum SelectionType{
    STATUS,
    CARRIERS,
    CLASSES
}
export enum DateType {
    CREATION,
    START
}

export enum IntervalType {
    DEPARTURE,
    RETURN,
    STOPS
}