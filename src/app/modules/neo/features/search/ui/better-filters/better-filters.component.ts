import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalControllerService } from 'src/app/core/services/modal-controller.service';
import { SearchService } from '../../data-access/search.service';
import { BetterFilterService, CheckboxFilterSelection, DateFilterSelection, DateType, IntervalFilterSelection, IntervalType, PriceFilterSelection, SelectionType } from '../../data-access/better-filter.service';

@Component({
  selector: 'app-better-filters',
  templateUrl: './better-filters.component.html',
  styleUrls: ['./better-filters.component.scss'],
  providers: [DatePipe]
})
export class BetterFiltersComponent implements OnInit {

    DateType = DateType;
    SelectionType = SelectionType;
    IntervalType = IntervalType;

    priceFilter$!: Observable<PriceFilterSelection>;
    checkboxFilter$!: Observable<Map<SelectionType, CheckboxFilterSelection[]>>;
    dateFilter$!: Observable<Map<DateType, DateFilterSelection>>;
    intervalFilter$!: Observable<Map<IntervalType, IntervalFilterSelection>>;

    public knownStatus!: { value: string, label: string, selected: boolean }[];

    constructor(
        private modalController: ModalControllerService,
        private betterFilterService: BetterFilterService,
        private datePipe: DatePipe,
        private searchService: SearchService
    ) {
    }

    ngOnInit(): void {
        this.priceFilter$ = this.betterFilterService.priceFilter;

        this.priceFilter$.subscribe((price: PriceFilterSelection) => {
            console.log(price);
        })
        this.checkboxFilter$ = this.betterFilterService.checkboxFilter;
        this.dateFilter$ = this.betterFilterService.dateFilter;
        this.intervalFilter$ = this.betterFilterService.intervalFilter;
    }

    get minSelectedDate(): string {
        const min: DateFilterSelection | undefined = this.betterFilterService.dateFilterSelection.get(DateType.CREATION);

        if (min == null) return this.formatDate(new Date());

        return this.formatDate(min.selected.min);

    }

    set minSelectedDate(date: string) {
        const selection: DateFilterSelection | undefined = this.betterFilterService.dateFilterSelection.get(DateType.CREATION);

        if (selection == null) return;

        selection.selected.min = new Date(date);

        this.betterFilterService.updateDateFilter(DateType.CREATION, selection);
    }

    get maxSelectedDate(): string {
        const max: DateFilterSelection | undefined = this.betterFilterService.dateFilterSelection.get(DateType.CREATION);

        if (max == null) return this.formatDate(new Date());

        return this.formatDate(max.selected.max);

    }

    set maxSelectedDate(date: string) {
        const selection: DateFilterSelection | undefined = this.betterFilterService.dateFilterSelection.get(DateType.CREATION);

        if (selection == null) return;

        selection.selected.max = new Date(date);

        this.betterFilterService.updateDateFilter(DateType.CREATION, selection);
    }

    get minStartSelectedDate(): string {
        const min: DateFilterSelection | undefined = this.betterFilterService.dateFilterSelection.get(DateType.START);

        if (min == null) return this.formatDate(new Date());

        return this.formatDate(min.selected.min);

    }

    set minStartSelectedDate(date: string) {
        const selection: DateFilterSelection | undefined = this.betterFilterService.dateFilterSelection.get(DateType.START);

        if (selection == null) return;

        selection.selected.min = new Date(date);

        this.betterFilterService.updateDateFilter(DateType.START, selection);
    }

    get maxStartSelectedDate(): string {
        const max: DateFilterSelection | undefined = this.betterFilterService.dateFilterSelection.get(DateType.START);

        if (max == null) return this.formatDate(new Date());

        return this.formatDate(max.selected.max);
    }

    set maxStartSelectedDate(date: string) {
        const selection: DateFilterSelection | undefined = this.betterFilterService.dateFilterSelection.get(DateType.START);

        if (selection == null) return;

        selection.selected.max = new Date(date);

        this.betterFilterService.updateDateFilter(DateType.START, selection);
    }

    selectStatus(options: { value: string, label: string, selected: boolean }[]) {
        this.knownStatus = options;
    }

    updateCheckboxes(type: SelectionType, options: { value: string, label: string, selected: boolean }[]) {
        this.betterFilterService.updateCheckboxFilter(type, options);
        this.searchService.applyFilters();
    }
    
    get priceSteps(): number {
        // fix dual knobs issue when values are too different
        return (this.betterFilterService.priceFilterSelection.max - this.betterFilterService.priceFilterSelection.min) * 0.2;
    }

    onChangePrice(event: {min: number, max: number}): void {
        let selection: PriceFilterSelection = this.betterFilterService.priceFilterSelection;

        selection.selected.max = event.max;
        selection.selected.min = event.min;

        this.betterFilterService.updatePriceFilter(selection);
        this.searchService.applyFilters();
    }

    onChangeDate(type: IntervalType, event: { min: number, max: number }): void {
        const selection: IntervalFilterSelection | undefined = this.betterFilterService.intervalFilterSelection.get(type)
        
        if(!selection) return;
        
        selection.selected.min = event.min;
        selection.selected.max = event.max;

        console.log(selection);

        this.betterFilterService.updateIntervalFilter(type, selection);

        this.searchService.applyFilters();
        // selection.selected.max = new Date(event.detail.value.upper);
        // selection.selected.min = ;



    }


    public formatDate(date: Date | undefined): string {
        if (date == null) return "";

        const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
        if (formattedDate == null) return "";

        return formattedDate;
    }

    get currency(): string {
        return this.betterFilterService.priceFilterSelection.currency;
    }

}
