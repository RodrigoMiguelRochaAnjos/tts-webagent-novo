import { JourneyType } from "../../journey-type.enum";
import { Passengers } from "./passager.model";
import { FlightRoute, FlightRoutes } from "../../route.model";

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


export class AirSearchRequestBuilder {

    private _routeType: JourneyType = JourneyType.ONE_WAY;
    private _routes: FlightRoutes = [];
    private _passengers: Passengers = [];
    private _currency: string = "";

    constructor() { }

    public build(): AirSearchRequest {
        return new AirSearchRequest(this._routeType, this._routes, this._passengers, this._currency);
    }

    public routeType(routeType: JourneyType): AirSearchRequestBuilder {
        this._routeType = routeType;
        return this;
    }

    public routes(routes: FlightRoute[]): AirSearchRequestBuilder {
        this._routes = routes;
        return this;
    }

    public outbound(route: FlightRoute): AirSearchRequestBuilder {
        this._routes.push(route);
        return this;
    }

    public inbound(route: FlightRoute): AirSearchRequestBuilder {
        this._routes.push(route);
        return this;
    }

    public passengers(passengers: Passengers): AirSearchRequestBuilder {
        this._passengers = passengers;
        return this;
    }

    public currency(currency: string): AirSearchRequestBuilder {
        this._currency = currency;
        return this;
    }

}