import { AirSearchPrice } from "../../../models/air-search-price.model";
import { FlightOption } from "../../../models/flight-option.model";

export class AirCheckoutDetailsRequest {
    price: AirSearchPrice;
    flights: FlightOption[];
    currency: string;

    constructor(
        price: AirSearchPrice,
        flights: FlightOption[],
        currency: string
    ) {
        this.price = price;
        this.flights = flights;
        this.currency = currency;
    }
}
