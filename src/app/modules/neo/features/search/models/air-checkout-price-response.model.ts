import { Contact } from "src/app/core/models/user/contact/contact.model";
import { AirSearchPrice } from "../../../models/air-search-price.model";
import { FlightOption } from "../../../models/flight-option.model";
import { Traveller } from "../../../models/traveller/traveller.model";
import { Payment } from "./payment.model";
import { SupplierInfo } from "./supplier-info.model";
import { BookingRefs } from "./booking-ref.model";

export class AirCheckoutPriceResponse {
    id!: string;
    price!: AirSearchPrice;
    flights!: FlightOption[];
    supplierInfos!: Map<string, SupplierInfo[]>;
    bookingRefs!: Map<string, BookingRefs>;
    passengers!: Traveller[];
    contact!: Contact;
    payments!: Payment[];
}