import { JourneyType } from "../../journey-type.enum";
import { Passengers } from "./passager.model";
import { FlightRoutes } from "../../route.model";

export class AirSearchRequest {
    // authentication: TravelFusionAuth;
    routeType: JourneyType;
    routes: FlightRoutes;
    passengers: Passengers;
    currency: string;

    constructor(
        routeType: JourneyType,
        routes: FlightRoutes,
        passengers: Passengers,
        currency: string
    ) {
        this.routeType = routeType;
        this.routes = routes;
        this.passengers = passengers;
        this.currency = currency;
    }
}