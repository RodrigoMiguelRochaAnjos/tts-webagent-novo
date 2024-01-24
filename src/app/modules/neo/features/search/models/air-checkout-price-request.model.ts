import { Contact } from "src/app/core/models/user/contact/contact.model";
import { AirSearchPrice } from "../../../models/air-search-price.model";
import { FlightOption } from "../../../models/flight-option.model";
import { Travellers } from "../../../models/traveller/traveller.model";
import { Payment } from "./payment.model";

export class AirCheckoutPriceRequest {
    price!: AirSearchPrice;
    flights!: FlightOption[];
    passengers!: Travellers;
    contact!: Contact;
    payments!: Payment[];
    currency!: string;
}