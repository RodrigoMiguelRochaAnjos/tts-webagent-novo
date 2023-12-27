import { Place } from "../../../models/place.model";

export declare type FlightRoutes = FlightRoute[];

export class FlightRoute {
    origin: Place;
    destination: Place;
    departureDate: string;
    departureTime!: string;

    constructor(origin: Place, destination: Place, departureDate: string) {
        this.origin = origin;
        this.destination = destination;
        this.departureDate = departureDate;
    }
}
