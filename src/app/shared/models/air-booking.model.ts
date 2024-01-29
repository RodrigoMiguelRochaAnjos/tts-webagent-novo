import { Contact } from "src/app/core/models/user/contact/contact.model";
import { BookingRef } from "src/app/modules/neo/features/search/models/booking-ref.model";
import { AirSearchPrice } from "src/app/modules/neo/models/air-search-price.model";
import { FlightOption } from "src/app/modules/neo/models/flight-option.model";
import { Traveller } from "src/app/modules/neo/models/traveller/traveller.model";

export declare type AirBookings = AirBooking[];

export class AirBooking {
	id!: string;
    createdAt!: Date;
	status!: string;
	price!: AirSearchPrice;
	flights!: FlightOption[];
    bookingRefs!: Map<string, BookingRef>;
	bookingCode!: string;
	passengers!: Traveller[];
    contact!: Contact;
	errors!: string[];
	warnings!: string[];

    public isValid(): boolean {
        return (
            this.id != null &&
            this.status != null &&
            this.price != null &&
            this.flights != null &&
            this.bookingRefs != null &&
            this.passengers != null &&
            this.contact != null 
        )
    }
}
