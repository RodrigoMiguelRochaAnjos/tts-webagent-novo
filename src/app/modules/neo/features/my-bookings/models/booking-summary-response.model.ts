import { AirSearchPrice } from "../../../models/air-search-price.model";

export declare type BookingSummaryResponse = BookingSummary[];
export class BookingSummary {
	bookingId!: string;
    createdAt!: Date;
	passengersNames!: string[];
	price!: AirSearchPrice;
    startDate!: Date;
	status!: string;

	show: boolean = true;

}