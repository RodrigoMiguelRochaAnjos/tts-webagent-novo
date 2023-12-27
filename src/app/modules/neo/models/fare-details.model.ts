import { BaggageInfos } from "./baggage-info.model";

export class FareDetails {
    baggageInfos!: BaggageInfos;
    bookingClass!: string;
    cabinClass!: string;
    description!: string;
    fareBasis!: string;
    privateFare!: boolean;
    ptc!: string;
}