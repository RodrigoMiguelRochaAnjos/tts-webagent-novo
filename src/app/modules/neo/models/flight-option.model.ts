import { AirSearchPrice } from "./air-search-price.model";
import { AirSegment } from "./air-segment.model";
import { Providers } from "./providers.enum";

export declare type FlightOptions = FlightOption[];

export abstract class FlightOption {
    id!: string;
    duration!: number;
    nStops!: number;
    price!: AirSearchPrice;
    provider!: Providers;
    searchId!: string;
    segments!: AirSegment[];
    show: boolean = true;

    constructor() {
        this.show = true;
    }
}