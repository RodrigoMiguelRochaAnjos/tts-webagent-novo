import { AirSearchPrice } from "../../air-search-price.model";
import { FlightOptions } from "../../flight-option.model";

export declare type AirSearchResults = AirSearchResponse[];

export class AirSearchResponse {
    id!: string;
    price!: AirSearchPrice;
    outbounds!: FlightOptions;
    inbounds!: FlightOptions;
    splitTicketing!: boolean;
    show: boolean = true;

    constructor() {
        this.show = true;
    }

    isSelectedRoundTrip(): boolean {
        return (
            this.inbounds &&
            this.inbounds.length > 0
        );
    }

    hasMultipleOptions(option: 'INBOUNDS' | 'OUTBOUNDS'): boolean {
        switch (option) {
            case 'INBOUNDS':
                return this.outbounds && this.outbounds.length > 1;
            case 'OUTBOUNDS':
                return this.inbounds && this.inbounds.length > 1;
        }
    }

}
