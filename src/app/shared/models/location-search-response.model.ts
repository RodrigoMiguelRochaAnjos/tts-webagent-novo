export declare type LocationSearchResponse = LocationSearch[];
export declare type Airports = Airport[];

export class LocationSearch {
    code!: string;
    name!: string;
    country!: Country;
    airports!: Airports
}

export class Country {
    code!: string;
    name!: string;
}

export class Airport {
    code!: string;
    name!: string;
    airport_type!: number
}

export enum LocationType {
    ORIGIN,
    DESTINATION
}