import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { StylingService } from '../../data-access/styling.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocationSearchService } from '../../data-access/location-search/location-search.service';
import { Observable } from 'rxjs';
import { Airport, LocationSearch, LocationSearchResponse, LocationType } from '../../models/responses/location-search-response.model';
import { SelectedLocation } from '../../models/selected-location.model';
import { LocationMapper } from '../../data-access/location-search/location.mapper';

@Component({
    selector: 'neo-input',
    templateUrl: './neo-input.component.html',
    styleUrls: ['./neo-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NeoInputComponent),
            multi: true,
        },
    ],
})
export class NeoInputComponent implements ControlValueAccessor, OnInit {

    results$!: Observable<LocationSearchResponse>;

    LocationType = LocationType;

    @Input() label: string = "";
    @Input() placeholder: string = "";
    @Input() value: string = "";
    @Input() ngModel: string = "";
    @Input() type: string = "text";
    @Input() locationType?: LocationType;

    @Output() public ngModelChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() public selectedLocation: EventEmitter<{ type: LocationType, location: SelectedLocation }> = new EventEmitter<{ type: LocationType, location: SelectedLocation }>();

    private innerValue: any;
    term: string = "";

    constructor(
        private locationSearchService: LocationSearchService
    ) { }

    ngOnInit(): void {
        this.results$ = this.locationSearchService.getResults();
    }

    get inputValue() :string {
        return this.ngModel === "" ? this.value : this.ngModel;
    }

    writeValue(obj: any): void {
        this.innerValue = obj
    }
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.propagateTouched = fn
    }
    setDisabledState?(isDisabled: boolean): void {
    }

    inputTriggered(event: Event): void {
        this.ngModelChange.emit((event.target as HTMLInputElement).value);
    }

    locationSelected(event: Event, location: LocationSearch, airport?: Airport): void {
        event.stopPropagation();

        if (this.locationType == null) return

        this.resetSearchField();

        const selected: SelectedLocation = LocationMapper.locationSearchToSelectedLocation(location, airport);

        this.selectedLocation.emit({ type: this.locationType, location: selected });

        this.value = selected.text;
    }

    searchLocation(event: Event): void {
        this.term = (event.target as HTMLInputElement).value;

        if (this.term.length > 2) this.locationSearchService.search(this.term)
    }

    resetSearchField(): void{
        this.term = "";
        this.value = "";
        this.locationSearchService.reset();
    }


    private propagateChange = (_: any) => { };
    private propagateTouched = () => { };
}
